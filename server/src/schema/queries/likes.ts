// Like an object/Take back a like from an object

import likes from "../models/likes";

export const like_object = async (req: any, res: any) => {
  const { object_id, book_id, user_id } = req.body;

  try {
    const check = await likes.findOne({ object_id: object_id, user_id: user_id });

    if (check) {
      await likes.deleteOne({ object_id: object_id, user_id: user_id });
      return res.json("Liked retrieved successfully!");
    } else {
      await likes.insertMany({
        object_id: object_id,
        user_id: user_id,
        book_id: book_id,
      });
      return res.json("Object liked successfully!");
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error: ${error}` });
  }
};

// Check if the current user liked the object

export const check_if_liked = async (req: any, res: any) => {
  const object_id = req.params.object_id;
  const user_id = req.params.user_id;

  try {
    const check = await likes.findOne({object_id: object_id, user_id: user_id})

    if(!check){
        return res.json(false)
    }else {
        return res.json(true)
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error: ${error}` });
  }
};
// Count the number of likes an object has

export const count_likes = async (req: any, res: any) => {
  const object_id = req.params.object_id;

  try {
    const count = await likes.find({object_id: object_id});

    return res.json(count.length)
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error: ${error}` });
  }
};
