import Post from "../models/Post.js";
import User from "../models/User.js";

// CREATE
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body; // details of the post that will come from the frontend
        const user = await User.findById(userId); // find the user in the db
        const newPost = new Post({ // create a new post
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        });
        await newPost.save(); // save to mongodb

        const post = await Post.find(); // grab all posts and returned to the frontend with the new post
        res.status(201).json(post); // send the post back to the frontend; 201 means "something is created"

    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

// READ
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find(); // grab all posts from the db
        res.status(200).json(post); // send the post back to the frontend; 200 means "successful request"

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params; // grab the userId 
        const post = await Post.find({ userId }); // grab all posts from a specific user
        res.status(200).json(post); // send the post back to the frontend; 200 means "successful request"

    } catch (err) {
        res.status(404).json({ message: err.message });
    } 
};

// UPDATE (LIKE OR UNLIKE A POST)
export const likePost = async (req, res) => {
    try {
        const { id } = req.params; // from the query string
        const { userId } = req.body;
        const post = await Post.findById(id); // grab post info
        const isLiked = post.likes.get(userId); // grab whether user has liked it or not

        // logic: delete if already liked, otherwise becomes liked
        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        // newly updated list of likes that we modified prior; update the frontend
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    } 
};