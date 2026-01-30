import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogAPI, reactionAPI } from '../services/api';
import Like from '../components/Like';
import Dislike from '../components/Dislike';
import CommentsSection from '../components/CommentsSection';
import Loader from '../components/ui/Loader';
import Badge from '../components/ui/Badge';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';

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
    if (blog) {
      fetchReactionStatus();
    }
  }, [blog, fetchReactionStatus]);

  const handleReactionUpdate = useCallback((type, newCount, newState) => {
    setReactionStatus((prev) => {
      if (type === 'like') {
        return {
          ...prev,
          likes: newCount,
          isLiked: newState,
          ...(newState && prev.isDisliked ? { isDisliked: false, dislikes: Math.max(0, prev.dislikes - 1) } : {}),
        };
      } else if (type === 'dislike') {
        return {
          ...prev,
          dislikes: newCount,
          isDisliked: newState,
          ...(newState && prev.isLiked ? { isLiked: false, likes: Math.max(0, prev.likes - 1) } : {}),
        };
      }
      return prev;
    });
    setTimeout(() => fetchReactionStatus(), 500);
  }, [fetchReactionStatus]);

  if (loading) {
    return <Loader className="min-h-screen" />;
  }

  if (!blog) {
    return <div className="text-center text-white text-xl py-20">Blog not found</div>;
  }

  const authorName = blog.author?.fullname || 'Unknown Author';
  // Calculate read time
  const readTime = Math.max(1, Math.ceil((blog.content?.split(' ').length || 0) / 200));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-fade-in">
      {/* Blog Metadata */}
      <div className="mb-8">
        <Badge variant="primary" className="mb-4">Development</Badge> {/* Placeholder for category */}
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6 leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 border-b border-slate-800 pb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mr-3 border border-slate-600">
              <FiUser className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <span className="block text-white font-medium">{authorName}</span>
              <span className="text-xs">Author</span>
            </div>
          </div>
          <div className="flex items-center">
            <FiCalendar className="mr-2" />
            {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center">
            <FiClock className="mr-2" />
            {readTime} min read
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="w-full mb-10 rounded-xl overflow-hidden shadow-2xl shadow-black/50">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-auto max-h-[600px] object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <div className="text-slate-300 leading-8 whitespace-pre-wrap">
          {blog.content}
        </div>
      </div>

      {/* Interaction Buttons */}
      <div className="flex items-center justify-between border-t border-b border-slate-800 py-6 mb-12">
        <div className="flex items-center space-x-6">
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
        <div className="text-slate-500 text-sm">
          Share this post
        </div>
      </div>

      {/* Comments Section */}
      <CommentsSection blogId={id} />
    </div>
  );
};

export default BlogDetails;
