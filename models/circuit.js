const mongoose = require("mongoose");

const circuitSchema = new mongoose.Schema({
    circuitId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, //fk rlt to user model on objectID
    name: { type: String, required: true },
    qubits: { type: Number, required: true },
    gates: { type: [String], required: true }
});

module.exports = mongoose.model("Circuit", circuitSchema);
