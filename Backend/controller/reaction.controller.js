import Like from "../model/like.model.js";
import Dislike from "../model/disLike.model.js";
import Blog from "../model/blog.model.js";

/**
 * Get full reaction status for a blog:
 * - Total Likes
 * - Total Dislikes
 * - Is current user liked?
 * - Is current user disliked?
 */
export async function getReactionStatus(req, res) {
  try {
    const { blogId } = req.params;

    const blogExists = await Blog.findById(blogId);
    if (!blogExists) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    const [likes, dislikes, likeDoc, dislikeDoc] = await Promise.all([
      Like.countDocuments({ blog: blogId }),
      Dislike.countDocuments({ blog: blogId }),
      Like.findOne({ blog: blogId, likedBy: req.user.id }),
      Dislike.findOne({ blog: blogId, dislikedBy: req.user.id })
    ]);

    return res.status(200).json({
      success: true,
      likes,
      dislikes,
      isLiked: !!likeDoc,       // !! Convert ANY value into a strict boolean (true or false) ; we are converting into boolean because frontend doesn't want object/document its just want the whether like is there or not instead !! we can also use isLiked: likeDoc ? true : false
      isDisliked: !!dislikeDoc 
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching reaction status"
    });
  }
}
