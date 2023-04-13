import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization"); // grab the authorization header

        if (!token) {
            return res.status(403).send("Access Denied");
        }

        // start the token with "Bearer and take everything from the right side"
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET); // verify the token
        req.user = verified; 
        next(); // run the next function

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};