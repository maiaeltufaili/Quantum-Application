const bcrypt = require("bcrypt"); //for hashing pws & comparing hashed pws upon login
const User = require("../models/User");

module.exports = {
    getLogin: (req, res) => res.render("login.njk", { username: req.session.username }),
    getRegister: (req, res) => res.render("register.njk", { username: req.session.username }),

    postRegister: async (req, res) => {
        const { username, password } = req.body;
        try {
            const hashed = await bcrypt.hash(password, 10); //hash pw. 10 is security strength. 10 rounds of salt
            await User.create({ username, password: hashed });
            res.redirect("/login");
        } catch {
            res.send("Username already exists");
        }
    },

    postLogin: async (req, res) => {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.send("Invalid login");

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.send("Invalid login");

        req.session.userId = user._id;
        req.session.username = user.username;
        res.redirect("/");
    },

    logout: (req, res) => {
        req.session.destroy(() => res.redirect("/"));
    }
};
