import { useState, useEffect, useCallback } from 'react';
import { commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiEdit2, FiTrash2, FiSend } from 'react-icons/fi';

const CommentsSection = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const fetchComments = useCallback(async () => {
    try {
      const response = await commentAPI.getComments(blogId);
      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [blogId]);

  const fetchCommentCount = useCallback(async () => {
    try {
      const response = await commentAPI.getCommentCount(blogId);
      if (response.data.success) {
        setCommentCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching comment count:', error);
    }
  }, [blogId]);

  useEffect(() => {
    if (blogId) {
      fetchComments();
      fetchCommentCount();
    }
  }, [blogId, fetchComments, fetchCommentCount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    setLoading(true);
    try {
      const response = await commentAPI.createComment(blogId, newComment);
      if (response.data.success) {
        setNewComment('');
        fetchComments();
        fetchCommentCount();
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (commentId) => {
    if (!editContent.trim()) return;

    setLoading(true);
    try {
      const response = await commentAPI.updateComment(commentId, editContent);
      if (response.data.success) {
        setEditingId(null);
        setEditContent('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setLoading(true);
    try {
      const response = await commentAPI.deleteComment(commentId);
      if (response.data.success) {
        fetchComments();
        fetchCommentCount();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const isOwner = (comment) => {
    return user && comment.owner && user._id === comment.owner._id;
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">
        Comments <span className="text-gray-400 text-lg">({commentCount})</span>
      </h2>

      {/* Add Comment Form */}
      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex space-x-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 resize-none"
              rows="3"
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <FiSend className="w-5 h-5" />
              <span>Post</span>
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              {editingId === comment._id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 resize-none mb-3"
                    rows="3"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(comment._id)}
                      disabled={loading || !editContent.trim()}
                      className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-semibold">
                        {comment.owner?.fullname || 'Unknown User'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {isAuthenticated && isOwner(comment) && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(comment)}
                          className="text-gray-400 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;

