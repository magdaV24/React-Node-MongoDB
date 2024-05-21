import comments from "../models/comment";
import user from "../models/user";

//Add a comment;

export const addComment = async (req: any, res: any) => {
  const { parentId, userId, bookId, content, date } = req.body;

  try {
    await comments.insertMany([
      {
        parentId: parentId,
        userId: userId,
        bookId: bookId,
        content: content,
        date: date,
      },
    ]);
    return res.status(200).json("Comment added to the database successfully");
  } catch (error) {
     return res
      .status(500)
      .json(`Internal server error: ${error}`);
  }
};

//Fetch comments by parentId;

export const fetchComments = async (req: any, res: any) => {
  const parentId = req.params.id;

  try {
    const result = await comments.find({ parentId: parentId });
    const commentList = await Promise.all(
      result.map(async (comment: any) =>{
        const userId = comment.userId;
        const writer = await user.findOne({_id: userId}).lean();
        if(!writer){
          return { ...comment.toObject(), avatar: null, username: '[deleted]'};
        }
        return {
          ...comment.toObject(),
          avatar: writer.avatar,
          username: writer.username,
        }
      })
    );
    return res.status(200).json(commentList);
  } catch (error) {
   return res
      .status(500)
      .json(`Internal server error: ${error}`);;
  }
};

// Deleting a user's comment

export const deleteComment = async (req: any, res: any) => {
  const id  = req.body.id;

  try {
    await comments.deleteMany({ parentId: id });
    await comments.deleteOne({ _id: id });
    return res.status(200).json("Comment deleted successfully");
  } catch (error) {
   return res
      .status(500)
      .json(`Internal server error: ${error}`);;
  }
};

//Edit comment

export const editComment = async (req: any, res: any) => {
  const { id, content } = req.body;

  try {
    await comments.updateOne({ _id: id }, { $set: { content: content } });
    return res.status(200).json("Comment edited successfully!");
  } catch (error) {
   return res
      .status(500)
      .json(`Internal server error: ${error}`);;
  }
};
