const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const loginController = async (req, res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res
            .status(400)
            .json({ status: 400, message: "Please enter all fields" });
    }

    try {
        // Check for existing user
        let user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ status: 400, message: "Invalid credentials" });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ status: 400, message: "Invalid credentials" });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        };

        // Sign token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
            (err, token) => {
                if (err) throw err;
                return res.status(200).json({
                    status: 200,
                    messsage: "login successfully",
                    data: {
                        token: token,
                        userId: user._id,
                        name: user.name,
                        email: user.email,
                    },
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            status: 500,
            data: {},
            message: "Internal server error",
        });
    }
};
module.exports = { loginController };
