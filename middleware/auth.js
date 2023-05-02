import jwt from "jsonwebtoken";

// ============================== AUTHORIZATION ==============================
// protect routes that require authorization by verifying the JWT in the request header
export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization"); // grab the token from the frontend

        if (!token) {
            return res.status(403).send("Access Denied");
        }

        // trims the token to remove the "Bearer " string that is common for JWTs
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET); // verifies the token using the secret key stored in env variable
        req.user = verified; // the verified token is stored in the request object
        next(); // run the next function

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};