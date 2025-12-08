import Blog from '../model/blog.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export async function createBlog(req, res) {
  try {
  //  console.log("BODY:", req.body);
    //console.log("FILES:", req.files);

    const { title, content } = req.body;

    if ([title, content].some(field => !field || field.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    let coverImageUrl = "";

    if (req.files?.coverImage?.[0]?.path) {
      const coverImagePath = req.files.coverImage[0].path;
      const uploadedImage = await uploadOnCloudinary(coverImagePath);

      if (!uploadedImage?.url) {
        return res.status(400).json({
          success: false,
          message: "Cover image upload failed"
        });
      }

      coverImageUrl = uploadedImage.url;
    }

    const blog = await Blog.create({
      title,
      content,
      coverImage: coverImageUrl,
      author: req.user.id
    });

    return res.status(200).json({
      success: true,
      blog,
      message: "Blog created Successfully !!"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in creating Blog"
    });
  }
}


export async function getAllBlogs(req,res) {
try {
       const blogs = await Blog.find({author:req.user.id})
  
       return res.status(200)
                 .json({
                  success:true,
                  blogs,
                  message:"Got All Blogs !!"
                 })
} catch (error) {
       return res.status(400)
                 .json({
                  success:false,
                  message:error.message||"Error in getting all blogs"
                 })
}}

export async function updateBlog(req,res) {
     // verifyJWT -> check if user is logged in -> attach req.user
     // This middleware only ensures:
     //✅ User is authenticated
     //❌ User owns the blog 
     // till now we have used this method but it is insecure beacause Any logged-in user can still update ANY blog by changing blogId in the URL
     // ya to ab ek naya middleware banao to verfiy blog owner 
     // export async function verifyBlogOwner(req, res, next) {
    // const { blogId } = req.params;
    // const blog = await Blog.findById(blogId);
      // if (!blog) {
    //   return res.status(404).json({ success: false, message: "Blog not found" });
      // }
    // if (blog.author.toString() !== req.user.id) {
    //   return res.status(403).json({ success: false, message: "Unauthorized" });
      // }
      //
      // next();
      //}
      // Route:
      //router.put("/update/:blogId", verifyJWT, verifyBlogOwner, updateBlog);
      //Controller (Now SAFE to use):
      //const updatedBlog = await Blog.findByIdAndUpdate(
      //blogId,
      //req.body,
      //{ new: true }
      //);
     
      // or instead make small change in code like change update from findByIdAndUpdate to findOneAndUpdate and also add author field in update function
    
     //You CAN use findByIdAndUpdate
     //❌ But ONLY if ownership is already checked by middleware because It ONLY filters by _id, nothing else
    
     //If you do NOT have ownership middleware, then:
     //❌ findByIdAndUpdate(blogId, ...) is NOT secure
     //🔐 Why findOneAndUpdate Is More Secure (Without Middleware)
     //Blog.findOneAndUpdate(
     //  { _id: blogId, author: req.user.id },
     //  req.body,
     //  { new: true }
     // )
     // This does TWO checks in a single DB query:
     // ✅ Blog exists
     // ✅ Blog belongs to the logged-in user
     // If either fails → update does NOT happen
     // This is called:
     // ✅ Query-level authorization (Most Secure)
      
     try {
      const {blogId} =req.params
      
      let coverImageUrl;
     if (req.file) { // assuming you're using multer to handle multipart/form-data
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (!uploadResult) {
        return res.status(500).json({
          success: false,
          message: 'Error uploading cover image'
        });
      }
      coverImageUrl = uploadResult.secure_url; // cloudinary url
    }

        // Build update object
    const updateData = { ...req.body };
    if (coverImageUrl) updateData.coverImage = coverImageUrl;

    // Update the blog securely using query-level authorization
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: blogId, author: req.user.id }, // ensures ownership
      updateData,
      { new: true }
    );
         // just updating text data
       // const updateBlog= await Blog.findOneAndUpdate(
      //                         { _id: blogId, author: req.user.id },
      //                           req.body,
      //                         { new: true }
      //                         )

      // if Blog doesn’t exist OR user doesn’t own it
          if (!updatedBlog) {
              return res.status(403).json({
                                        success: false,
                                        message: "Unauthorized or Blog not found"
                                        });
          }

      return res.status(200)
                .json({
                 success:true,
                 updatedBlog,
                 message:"Blog Updated Successfully"
                })
     } catch (error) {
      return res.status(400)
                 .json({
                  success:false,
                  message:error.message||"Error in updating blog"
                 })
     }
}
// similarly for deleting blog we'll use findOneAndDelete instead findByIdAndDelete
export async function deleteBlog(req, res) {
  try {
    const { blogId } = req.params;

    const deletedBlog = await Blog.findOneAndDelete({
      _id: blogId,
      author: req.user.id
    });

    if (!deletedBlog) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized or Blog not found"
      });
    }

    return res.status(200).json({
      success: true,
      deletedBlog,// Because findOneAndDelete RETURNS the Deleted Document and also it will be useful for frontend
      message: "Blog deleted Successfully"
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Error in deleting blog"
    });
  }
}

// Get Single Blog by ID (Public View)
// Used when user clicks a blog to read full content.

export async function getBlogById(req, res) {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId).populate("author", "username fullname");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    return res.status(200).json({
      success: true,
      blog
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get All Blogs (Public Feed)
// Different from getAllBlogs (which is user-specific)
export async function getPublicBlogs(req, res) {
  try {
    const blogs = await Blog.find().populate("author", "username fullname");//populate() replaces an ObjectId reference with the actual document data from another collection.
    // Without it:
    // ❌ You only get user IDs
    // ❌ Frontend must make another API call to fetch user data
   // With it:
   // ✅ You get everything in ONE API call
    // ✅ Faster performance
    // ✅ Cleaner frontend code
    return res.status(200).json({
      success: true,
      blogs
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
