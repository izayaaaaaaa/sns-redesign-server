import User from '../models/User.js';

// READ
export const getUser = async (req, res) => {
    try {
        const { id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user); // send back everything relevant to the user after finding it

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}
export const getUserFriends = async (req, res) => {
    try {
        const { id} = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id)) // map through the friends array and find each friend by their id
        )
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }   
};

// UPDATE
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        // logic for ensuring that add/remove happens on both parties' end
        if (user.friends.includes(friendId)) { // if the user's friends array includes the friendId
            user.friends = user.friends.filter((id) => id !== friendId); // remove friendId from user's friends array
            friend.friends = friend.friends.filter((id) => id !== id); // remove user's id from friend's friends array
        } else {
            user.friends.push(friendId); // add friendId to user's friends array if not included
            friend.friends.push(id); // add user's id to friend's friends array if not included
        }
        await user.save();
        await friend.save();


        // format the friends array
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id)) // map through the friends array and find each friend by their id
        )
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}