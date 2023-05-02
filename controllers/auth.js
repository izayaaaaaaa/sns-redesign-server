// Purpose: Handle user authentication
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ============================== AUTHENTICATION ==============================

// REGISTER USER

// API call frontend -> backend -> db
export const register = async (req, res) => { // request from frontend, respond to frontend
    try {

        // frontend will contain an object containing the ff arguments
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location, 
      occupation,
    } = req.body; // grab said arguments

        const salt = await bcrypt.genSalt(); // encryption used for password
        const passwordHash = await bcrypt.hash(password, salt); // encrypt password
        // when a new user is created, the password hash will be saved in the database 
        // guarantees that even the devs can't see the password
        
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
        })
        const savedUser = await newUser.save(); // save the new user in the database 
        res.status(201).json(savedUser); // 201 "something has been created"

    } catch (err) {
        res.status(500).json({ error: err.message }); // 500 "internal server error"
    }
}

// LOG IN USER
export const login = async (req, res) => {
    try {
        // upon login, the password will be salted and hashed and compared to the password hash in the database
        // a webtoken will be given to the user upon successful login
        const { email, password } = req.body; // grab email and pw when the user tries to log in
        const user = await User.findOne({ email: email}); // use mongoose to find the user in the database
        
        if (!user) return res.status(400).json({ msg: "User does not exist"});

        const isMatch = await bcrypt.compare(password, user.password); // compare the password entered with the password in the database
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials"});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // token is created that is directly linked to the user's mongodb id; secret is custom generated from the env file
        delete user.password; // so it doesn't get sent back to frontend
        res.status(200).json({ token, user}); // 200 "everything is ok"

    } catch (err) {
        res.status(500).json({ error: err.message }); // 500 "internal server error"
    }
};