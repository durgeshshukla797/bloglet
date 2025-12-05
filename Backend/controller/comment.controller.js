import Blog  from '../model/blog.model.js'
import Comment from '../model/comment.model.js'

export async function createComment(req,res) {
   try {
     const {content} =req.body
     if (!content || content.trim() === "") {
           return res.status(400).json({
           success: false,
           message: "Comment content is required"
           });
      }

     const {blogId} =req.params
      
     const blogExists = await Blog.findById(blogId);
     if(!blogExists){
          return res.status(404).json({
           success: false,
           message: "Blog not found"
         });
     }
 
     const comment =await Comment.create({
       content,
       blog:blogId,
       owner:req.user.id
     })
 
       return res.status(201).json({
           success: true,
           comment,
           message: "Comment is created"
         });
   } catch (error) {
     return res.status(500).json({
          success: false,
          message: error.message||"Error in creating Comment"
        });
   }
}

export async function deleteComment(req,res) {
  try {
      //const {blogId} =req.params
      //  But one blog can have MANY comments.
      // So this will:
      // Delete ANY ONE random comment of that user on that blog
      // You cannot target a specific comment
     //  You MUST delete using commentId instead
     // this things we have not did for like because we know user can have only one like on one blog but comment can be multiple on that blog
    
     const { commentId } = req.params;
       
    const deleteComment = await Comment.findOneAndDelete({
        _id: commentId,
        owner: req.user.id
    })
   
    if(!deleteComment){
       return res.status(404).json({
            success: false,
            message: "Comment not found"
          });
    }
     return res.status(200).json({
            success: true,
            deleteComment,
            message: "Comment deleted SuccessFully!!"
          });
  } catch (error) {
     return res.status(500).json({
          success: false,
          message: error.message||"Error in deleting Comment"
        });
  }
}

// Always remember ki deleteComment ya deleteLike karne se pahele blog ka existence check karne ki jarurat nahi hai 
// because If the blog does not exist, the like or comment also cannot exist db simply return null

//then Why We MUST Check Blog in createLike() or createComment()?
//Because in createLike()/createDocument we are CREATING a new record:
//await Like.create({ blog: blogId })
//If we don’t check:
// Likes get created for fake / deleted blogs
// Database pollution
// Wrong analytics
// Broken UI