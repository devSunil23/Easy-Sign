const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const signupController = async (req, res) => {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
        return res
            .status(400)
            .json({
                status: 400,
                message: "Please enter all fields",
                data: "",
            });
    }

    try {
        // Check for existing user
        let user = await User.findOne({ email });
        if (user) {
            return res
                .status(400)
                .json({
                    status: 400,
                    message: "User already exists",
                    data: "",
                });
        }

        // Create new user
        user = new User({
            name,
            email,
            password,
        });

        // Hash password before saving in database
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user
        await user.save();
        return res.status(200).json({
            status: 200,
            message: "User registered successfully",
            data: "",
        });
        console.log("saved");
    } catch (err) {
        console.error(err.message);
        // Handle error
        return res.status(500).json({
            status: 500,
            data: {},
            message: "Internal server error",
        });
    }
};
module.exports = { signupController };
