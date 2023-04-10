import express from "express";
import { 
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser); // get user
router.get("/:id/friends", verifyToken, getUserFriends); // get user friends

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend); // add/remove friend

export default router;