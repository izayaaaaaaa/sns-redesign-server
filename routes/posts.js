import express from 'express';
import { getFeedPosts, getUserPosts, likePost } from '../controllers/posts.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// READ
router.get("/", verifyToken, getFeedPosts); // grab all posts from the db 
router.get("/:userId/posts", verifyToken, getUserPosts); // grab all posts from a specific user

// UPDATE
router.patch("/:id/like", verifyToken, likePost); // liking/unliking a post

export default router;
