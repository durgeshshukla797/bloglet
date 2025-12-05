import Like from '../model/like.model.js';
import Dislike from '../model/disLike.model.js';
import Blog from '../model/blog.model.js';

export async function dislikeBlog(req, res) {
  try {
    const { blogId } = req.params;

    const blogExists = await Blog.findById(blogId);
    if (!blogExists) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    // Remove like if exists
    await Like.findOneAndDelete({
      blog: blogId,
      likedBy: req.user.id
    });

    // Prevent double dislike
    const alreadyDisliked = await Dislike.findOne({
      blog: blogId,
      dislikedBy: req.user.id
    });

    if (alreadyDisliked) {
      return res.status(409).json({
        success: false,
        message: "Already disliked"
      });
    }

    const disliked = await Dislike.create({
      blog: blogId,
      dislikedBy: req.user.id
    });

    return res.status(201).json({
      success: true,
      disliked,
      message: "Blog disliked"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error disliking blog"
    });
  }
}

export async function removeDislike(req, res) {
  const { blogId } = req.params;

  const removed = await Dislike.findOneAndDelete({
    blog: blogId,
    dislikedBy: req.user.id
  });

  if (!removed) {
    return res.status(404).json({
      success: false,
      message: "Dislike not found"
    });
  }

  return res.status(200).json({
    success: true,
    message: "Dislike removed"
  });
}
