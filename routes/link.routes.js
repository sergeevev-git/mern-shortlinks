const { Router } = require("express");
const router = Router();
const Link = require("../models/link");
const auth = require("../middleware/auth.middleware");
const config = require("config");
const shortId = require("shortid");

router.post("/generate", auth, async (req, res) => {
    // console.log("req.body:", req.body);
    try {
        const baseUrl = config.get("BASE_URL");
        const { from } = req.body;
        console.log("from:", from);

        const code = shortId.generate();
        // const existing = await Link.findOne({ from, owner: req.user.userId });
        const existing = await Link.findOne({ from });
        // console.log("existing:", existing);

        if (existing) {
            return res.status(200).json({ link: existing });
        }

        const to = baseUrl + "/t/" + code;

        const link = Link({
            code,
            to,
            from,
            owner: req.user.userId,
        });
        link.save();
        res.status(201).json({ link });
    } catch (error) {
        res.status(500).json({ message: `ошибка ${error}` });
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const links = await Link.find({ owner: req.user.userId });
        res.json(links);
    } catch (error) {
        res.status(500).json({ message: `ошибка ${error}` });
    }
});
router.get("/:id", auth, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id);
        res.json(link);
    } catch (error) {
        res.status(500).json({ message: `ошибка ${error}` });
    }
});

module.exports = router;
