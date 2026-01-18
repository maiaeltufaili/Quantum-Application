const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "temp_uploads/" });
const circuitController = require("../controllers/circuitController");

function requireAuth(req, res, next) {
    if (!req.session.userId) return res.redirect("/login");
    next();
}

router.get("/", circuitController.home);
router.get("/all-circuits", requireAuth, circuitController.allCircuits);
router.get("/submit-circuit", requireAuth, circuitController.getSubmitCircuit);
router.post("/submit-circuit", requireAuth, circuitController.postSubmitCircuit);
router.get("/circuit/:id", requireAuth, circuitController.viewCircuit);
router.get("/download/:id", requireAuth, circuitController.downloadCircuit);
router.get("/upload", requireAuth, circuitController.getUpload);
router.post("/upload", requireAuth, upload.single("circuitFile"), circuitController.postUpload);
router.get("/search", requireAuth, circuitController.getSearchPage);
router.get("/api/search", requireAuth, circuitController.apiSearch);
router.get("/simulate/:id", requireAuth, circuitController.simulateCircuit);

module.exports = router;
