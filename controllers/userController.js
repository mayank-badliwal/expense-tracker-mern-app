
// const userModel = require('../models/userModel')

// //;ogin callback
// const loginController = async (req, res) => {
//     try {
//         const { email, password } = req.body
//         const user = await userModel.findOne({ email, password })
//         if (!user) {
//             return res.status(404).send("User not found");
//         }
//         res.status(200).json({
//             success : true,
//             user,
//         });

//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             error,
//         })
//     }
// };

// //register callback
// const registerController = async (req, res) => { 
//     try {
//         const newUser = new userModel(req.body);
//         await newUser.save();
//         res.status(201).json({
//             success: true,
//             newUser,
//         })

//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             error,
//         });
//     }
// };

// module.exports = { loginController, registerController };







// // From CHATGPT


// // controllers/userController.js
// // const bcrypt = require('bcrypt');
// // const userModel = require('../models/userModel');

// // // Login Controller
// // const loginController = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     const user = await userModel.findOne({ email });

// //     if (!user) {
// //       return res.status(404).json({ success: false, message: "User not found" });
// //     }

// //     // Compare hashed password
// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       return res.status(401).json({ success: false, message: "Invalid credentials" });
// //     }

// //     res.status(200).json({
// //       success: true,
// //       message: "Login successful",
// //       user
// //     });

// //   } catch (error) {
// //     console.error("Login Error:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Server error",
// //       error: error.message
// //     });
// //   }
// // };

// // // Register Controller
// // const registerController = async (req, res) => {
// //   try {
// //     const { username, email, password } = req.body;

// //     // Check if user already exists
// //     const existingUser = await userModel.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({ success: false, message: "User already exists" });
// //     }

// //     // Hash password
// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(password, salt);

// //     // Create new user
// //     const newUser = new userModel({
// //       username,
// //       email,
// //       password: hashedPassword,
// //     });

// //     await newUser.save();
// //     res.status(201).json({
// //       success: true,
// //       message: "User registered successfully",
// //       user: newUser,
// //     });

// //   } catch (error) {
// //     console.error("Registration Error:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Server error",
// //       error: error.message,
// //     });
// //   }
// // };

// // module.exports = { loginController, registerController };




// LOGIN CONTROLLER
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("🔐 Login Attempt");
        console.log("📩 Email:", email);
        console.log("🔑 Password (input):", password);

        const user = await userModel.findOne({ email });

        if (!user) {
            console.log("❌ User not found");
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log("✅ Found user in DB:", user.email);
        console.log("📦 Password in DB:", user.password);
        console.log("📥 Password from input:", password);
        console.log("🔁 password === user.password:", password === user.password);


        const isHashed = user.password.startsWith("$2b$");
        let isMatch = false;

        if (isHashed) {
            console.log("🧪 Comparing bcrypt hash...");
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            console.log("🧪 Comparing plain password...");
            isMatch = password === user.password;

            if (isMatch) {
                console.log("🔁 Upgrading to bcrypt...");
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                user.password = hashedPassword;
                await user.save();
                console.log("✅ Password upgraded to hash.");
            }
        }

        if (!isMatch) {
            console.log("❌ Invalid credentials");
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        console.log("✅ Login success!");
        res.status(200).json({
            success: true,
            message: "Login successful",
            user,
        });

    } catch (error) {
        console.error("💥 Login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
};




// REGISTER CONTROLLER
const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message,
        });
    }
};

module.exports = { loginController, registerController };
