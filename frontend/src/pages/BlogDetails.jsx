import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogAPI, reactionAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Like from '../components/Like';
import Dislike from '../components/Dislike';
import CommentsSection from '../components/CommentsSection';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reactionStatus, setReactionStatus] = useState({
    likes: 0,
    dislikes: 0,
    isLiked: false,
    isDisliked: false,
  });

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getBlogById(id);
      if (response.data.success) {
        setBlog(response.data.blog);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const fetchReactionStatus = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      
      // Always fetch public counts first
      const publicResponse = await reactionAPI.getPublicReactionCounts(id);
      if (publicResponse.data.success) {
        setReactionStatus((prev) => ({
          ...prev,
          likes: publicResponse.data.likes,
          dislikes: publicResponse.data.dislikes,
        }));
      }

      // If user is authenticated, also fetch their reaction status
      if (user) {
        try {
          const response = await reactionAPI.getReactionStatus(id);
          if (response.data.success) {
            setReactionStatus({
              likes: response.data.likes,
              dislikes: response.data.dislikes,
              isLiked: response.data.isLiked,
              isDisliked: response.data.isDisliked,
            });
          }
        } catch (authError) {
          // If auth request fails, we still have the public counts
          console.error('Error fetching user reaction status:', authError);
        }
      }
    } catch (error) {
      console.error('Error fetching reaction status:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  useEffect(() => {
    // Fetch reaction status after blog is loaded
    if (blog) {
      fetchReactionStatus();
    }
  }, [blog, fetchReactionStatus]);

  const handleReactionUpdate = useCallback((type, newCount, newState) => {
    setReactionStatus((prev) => {
      if (type === 'like') {
        // Backend automatically removes dislike when like is added
        return {
          ...prev,
          likes: newCount,
          isLiked: newState,
          // If we're liking and previously disliked, the backend removes the dislike
          ...(newState && prev.isDisliked ? { isDisliked: false, dislikes: Math.max(0, prev.dislikes - 1) } : {}),
        };
      } else if (type === 'dislike') {
        // Backend automatically removes like when dislike is added
        return {
          ...prev,
          dislikes: newCount,
          isDisliked: newState,
          // If we're disliking and previously liked, the backend removes the like
          ...(newState && prev.isLiked ? { isLiked: false, likes: Math.max(0, prev.likes - 1) } : {}),
        };
      }
      return prev;
    });
    // Refetch to ensure sync with backend
    setTimeout(() => {
      fetchReactionStatus();
    }, 500);
  }, [fetchReactionStatus]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Blog not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  const authorName = blog.author?.fullname || 'Unknown Author';

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="w-full mb-8 rounded-lg overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-auto max-h-[600px] object-contain"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {blog.title}
        </h1>

        {/* Author */}
        <div className="mb-8">
          <p className="text-gray-400">
            By <span className="text-white font-semibold">{authorName}</span>
            {' • '}
            <span className="text-gray-500">
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none mb-12">
          <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </div>
        </div>

        {/* Interaction Buttons */}
        <div className="flex justify-center items-center space-x-4 mb-12">
          <Like
            blogId={id}
            initialCount={reactionStatus.likes}
            initialLiked={reactionStatus.isLiked}
            onUpdate={(count, state) => handleReactionUpdate('like', count, state)}
          />
          <Dislike
            blogId={id}
            initialCount={reactionStatus.dislikes}
            initialDisliked={reactionStatus.isDisliked}
            onUpdate={(count, state) => handleReactionUpdate('dislike', count, state)}
          />
        </div>

        {/* Comments Section */}
        <CommentsSection blogId={id} />
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetails;

