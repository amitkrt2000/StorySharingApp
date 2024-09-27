const User = require("../../schemas/user");
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    try{
        const {username,password} = req.body;
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

    // Check if user already exists
    const user = await User.findOne({ username });
    if (user) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
        username,
        password: hashedPassword,

    });

    
        await newUser.save();
        return res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error registering user",
            error: error.message,
        });
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "wrong Username or Password" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: " wrong Username or Password" });
        } else {
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
            return res.header("auth-token", token).json({ message: "Logged in successfully", token });
            console.log('TOKEN_SECRET:', process.env.TOKEN_SECRET);
            

        }
        
    } 
    catch(err) {
        next(err);
    }
});

module.exports = router;