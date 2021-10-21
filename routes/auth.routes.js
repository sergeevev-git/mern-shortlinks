const { Router } = require("express");
const router = Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

// there is prefix /api/auth
router.post(
    "/register",
    [
        check("email", "некорректный email").isEmail(),
        check("password", "минимальная длина паролья 6 символов").isLength({
            min: 6,
        }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errros: errors.array(),
                    message: "некорректные данные при регистрации",
                });
            }

            const { email, password } = req.body;

            const candidate = await User.findOne({ email });

            if (candidate) {
                console.log("данный email");
                return response
                    .status(400)
                    .json({ message: "данный email уже зарегистрирован" });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({ email, password: hashedPassword });

            await user.save();

            res.status(201).json({ message: "пользователь создан" });
        } catch (error) {
            res.status(500).json({ message: `ошибка регистрации ${error}` });
        }
    }
);

router.post(
    "/login",
    [
        check("email", "Введите корректный email").normalizeEmail().isEmail(),
        check("password", "Введите пароль").exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errros: errors.array(),
                    message: "некорректные данные при входе в систему",
                });
            }

            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({ message: "Пользователь не найден" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: "неверный пароль" });
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get("JWT_SECRET"),
                { expiresIn: "1h" }
            );

            res.json({ token, userId: user.id });
        } catch (error) {
            res.status(500).json({ message: `ошибка авторизации ${error}` });
        }
    }
);

module.exports = router;
