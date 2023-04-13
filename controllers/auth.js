import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ============================== AUTHENTICATION ==============================

// REGISTER USER
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location, 
      occupation,
    } = req.body;

        const salt = await bcrypt.genSalt(); // encryption used for password
        const passwordHash = await bcrypt.hash(password, salt); // encrypt password

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
    });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); // 201 "something has been created"

    } catch (err) {
        res.status(500).json({ error: err.message }); // 500 "internal server error"
    }
}

// LOG IN USER
export const login = async (req, res) => {
    try {
        const { email, password } = req.body; // grab email and pw when the user tries to log in
        const user = await User.findOne({ email: email}); // use mongoose to find the user in the database
        
        if (!user) return res.status(400).json({ msg: "User does not exist"});

        const isMatch = await bcrypt.compare(password, user.password); // compare the password entered with the password in the database
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials"});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password; // so it doesn't get sent back to frontend
        res.status(200).json({ token, user}); // 200 "everything is ok"

    } catch (err) {
        res.status(500).json({ error: err.message }); // 500 "internal server error"
    }
};