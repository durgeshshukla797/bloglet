//toggle like
//const existingLike = await Like.findOne({ blog: blogId, likedBy: req.user.id });

  //if (existingLike) {
  // UNLIKE
  //await Like.findByIdAndDelete(existingLike._id);
  //return res.json({ message: "Unliked" });
  //} else {
  // LIKE
  //await Like.create({ blog: blogId, likedBy: req.user.id });
  //return res.json({ message: "Liked" });
  //}

  import Like from '../model/like.model.js';
  import Dislike from '../model/disLike.model.js';
  import Blog from '../model/blog.model.js';
  
  export async function likeBlog(req, res) {
    // to do like user need to be loggedIn and thus there will be middleware before this func to authenticate user
    // from that we get likedBy as it will store in req.user
    // Since whenever the blog is clicked so it's id definitely will be present in url
    try {
      const { blogId } = req.params;
  
      const blogExists = await Blog.findById(blogId);
      if (!blogExists) {
        return res.status(404).json({
          success: false,
          message: "Blog not found"
        });
      }
  
      //  Remove dislike if exists
      await Dislike.findOneAndDelete({
        blog: blogId,
        dislikedBy: req.user.id
      });
  
      // Prevent double like
      const alreadyLiked = await Like.findOne({
        blog: blogId,
        likedBy: req.user.id
      });
  
      if (alreadyLiked) {
        return res.status(409).json({
          success: false,
          message: "Already liked"
        });
      }
  
      const liked = await Like.create({
        blog: blogId,
        likedBy: req.user.id
      });
  
      return res.status(201).json({
        success: true,
        liked,
        message: "Blog liked"
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error liking blog"
      });
    }
  }
  
  export async function removeLike(req, res) {
  const { blogId } = req.params;

  const removed = await Like.findOneAndDelete({
    blog: blogId,
    likedBy: req.user.id
  });

  if (!removed) {
    return res.status(404).json({
      success: false,
      message: "Like not found"
    });
  }

  return res.status(200).json({
    success: true,
    message: "Like removed"
  });
}
