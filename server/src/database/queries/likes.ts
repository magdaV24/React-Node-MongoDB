import likes from "../models/like";

export const likeObject = async (req: any, res: any) => {
  const { objectId, bookId, userId } = req.body;

  try {
    const check = await likes.findOne({ objectId: objectId, userId: userId });

    if (check) {
      await likes.deleteOne({ objectId: objectId, userId: userId });
      return res.status(200).json("Liked retrieved successfully!");
    } else {
      await likes.insertMany({
        objectId: objectId,
        userId: userId,
        bookId: bookId,
      });
      return res.status(200).json("Object liked successfully!");
    }
  } catch (error) {
    return res
      .status(500)
      .json(`Internal server error: ${error}`);
  }
};

// Check if the current user liked the object

export const checkIfLiked = async (req: any, res: any) => {
  const objectId = req.params.objectId;
  const userId = req.params.userId;

  try {
    const check = await likes.findOne({objectId: objectId, userId: userId})

    if(!check){
        return res.status(200).json(false)
    }else {
        return res.status(200).json(true)
    }
  } catch (error) {
    
    return res
      .status(500)
      .json(`Internal server error: ${error}`);
  }
};
// Count the number of likes an object has

export const countLikes = async (req: any, res: any) => {
  const objectId = req.params.objectId;

  try {
    const count = await likes.find({objectId: objectId});

    return res.json(count.length)
  } catch (error) {
    
    return res
      .status(500)
      .json(`Internal server error: ${error}`);
  }
};
