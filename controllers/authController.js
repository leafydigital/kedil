const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Register User
exports.register = async (req, res) => {
    const { first_name, last_name, email, password, phone_number, address } = req.body;

    try {

        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({ ...req.body, password: hashedPassword });

        await user.save();

        const token = jwt.sign({ user_id: user._id }, JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({ token, message: "Registered Successfully!" });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Login User
exports.login = async (req, res) => {
    // const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // console.log("User", user.password);

        // console.log("Password", await bcrypt.hash(req.body.password, 10));

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ user_id: user._id }, JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
