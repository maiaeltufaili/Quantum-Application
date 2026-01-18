const Circuit = require("../models/Circuit");
const fsp = require("fs").promises; //promise version of file system module

module.exports = {
    home: (req, res) => res.render("home.njk", { username: req.session.username }),

    allCircuits: async (req, res) => {
        const circuits = await Circuit.find({ userId: req.session.userId }, "circuitId name");
        res.render("all-circuits.njk", {
            circuits: circuits.map(c => ({ id: c.circuitId, name: c.name })),
            username: req.session.username
        });
    },

    getSubmitCircuit: (req, res) => res.render("submit-circuit.njk", { username: req.session.username }),

    postSubmitCircuit: async (req, res) => {
        const { name, qubits, gates } = req.body;
        const gatesArr = gates.split(",").map(g => g.trim().toUpperCase());
        const circuitId = Date.now().toString();

        await Circuit.create({
            circuitId,
            userId: req.session.userId,
            name,
            qubits: parseInt(qubits),
            gates: gatesArr
        });
        res.redirect("/all-circuits");
    },

    viewCircuit: async (req, res) => {
        const circuit = await Circuit.findOne({ circuitId: req.params.id, userId: req.session.userId });
        if (!circuit) return res.status(404).send("Not found");

        const qubitLines = Array.from({ length: circuit.qubits }, (_, i) => `Qubit ${i}: ─`);
        circuit.gates.forEach(g => {
            if (g === "CNOT" && circuit.qubits >= 2) {
                qubitLines[0] += "─[●]─";
                qubitLines[1] += "─[X]─";
                for (let i = 2; i < circuit.qubits; i++) qubitLines[i] += "────";
            } else qubitLines.forEach((_, i) => qubitLines[i] += `[${g}]─`);
        });

        res.render("circuit.njk", {
            circuit,
            circuitId: circuit.circuitId,
            diagram: qubitLines,
            username: req.session.username
        });
    },

    getUpload: (req, res) => res.render("upload.njk", { username: req.session.username }),

    postUpload: async (req, res) => {
        if (!req.file) return res.status(400).send("No file uploaded");

        try {
            const text = await fsp.readFile(req.file.path, "utf-8");
            const parsed = JSON.parse(text);
            const { name, qubits, gates } = parsed;
            const circuitId = parsed._id || Date.now().toString();

            const exists = await Circuit.findOne({ circuitId, userId: req.session.userId });
            if (exists) return res.status(409).send("Circuit already exists");

            await Circuit.create({
                circuitId,
                userId: req.session.userId,
                name,
                qubits,
                gates
            });

            await fsp.unlink(req.file.path);
            res.redirect(`/circuit/${circuitId}`);
        } catch (err) {
            console.error(err);
            res.status(500).send("Upload error");
        }
    },

    getSearchPage: (req, res) => res.render("search.njk", { username: req.session.username }),

    apiSearch: async (req, res) => {
        const gate = req.query.gate?.toUpperCase(); //? prevents server crash if no gates were provided
        if (!gate) return res.json([]);

        const results = await Circuit.find({ gates: gate, userId: req.session.userId });
        res.json(results.map(c => ({ id: c.circuitId, name: c.name })));
    },
    simulateCircuit: async (req, res) => {
        try {
            const circuit = await Circuit.findOne({ circuitId: req.params.id, userId: req.session.userId }).lean();
            if (!circuit) return res.status(404).send("Circuit not found");

            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            res.flushHeaders(); //send the headers before response

            let countdown = 5;

            const interval = setInterval(() => {
                if (countdown > 0) {
                    res.write(`data: Countdown: ${countdown}\n\n`);
                    countdown--;
                } else {
                    clearInterval(interval);

                    // Simple simulation
                    const qubitStates = Array(circuit.qubits).fill(0);
                    circuit.gates.forEach(g => {
                        if (g === "X") qubitStates[0] ^= 1;
                        if (g === "H") qubitStates[0] = Math.round(Math.random());
                        if (g === "CNOT" && qubitStates[0] === 1 && qubitStates.length >= 2) qubitStates[1] ^= 1;
                    });

                    res.write(`event: end\ndata: Simulation done! ${qubitStates.map((q,i)=>`Q${i}=${q}`).join(", ")}\n\n`);
                    res.end();
                }
            }, 1000);

            req.on("close", () => clearInterval(interval));
        } catch (err) {
            console.error(err);
            res.status(500).send("Simulation error");
        }
    },
    downloadCircuit: async (req, res) => {
        try {
            const circuit = await Circuit.findOne({ circuitId: req.params.id, userId: req.session.userId }).lean();
            if (!circuit) return res.status(404).send("Circuit not found");

            res.setHeader("Content-Disposition", `attachment; filename=circuit-${circuit.name}.json`);
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify({
                circuitId: circuit.circuitId,
                name: circuit.name,
                qubits: circuit.qubits,
                gates: circuit.gates
            }, null, 2));
        } catch (err) {
            console.error(err);
            res.status(500).send("Download error");
        }
    }


};
