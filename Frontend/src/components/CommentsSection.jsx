import { useState, useEffect, useCallback } from 'react';
import { commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiEdit2, FiTrash2, FiSend, FiMessageSquare } from 'react-icons/fi';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

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
    <div className="mt-12 bg-dark-card/30 rounded-2xl p-6 sm:p-8 border border-slate-800">
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
        <FiMessageSquare className="mr-3 text-primary-500" />
        Comments <span className="text-slate-500 text-lg ml-2">({commentCount})</span>
      </h2>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts?"
                className="w-full bg-dark-bg border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 resize-none min-h-[100px]"
              />
            </div>
            <div className="flex-shrink-0">
              <Button type="submit" loading={loading} disabled={!newComment.trim()}>
                <FiSend className="mr-2" /> Post
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 mb-8 text-center text-primary-200">
          Please login to join the discussion.
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-dark-bg/50 rounded-lg border border-slate-800 border-dashed">
            No comments yet. Be the first to start the conversation!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="group animate-fade-in">
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 font-bold text-slate-300">
                    {comment.owner?.fullname?.charAt(0).toUpperCase() || '?'}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="bg-dark-bg rounded-2xl p-4 border border-slate-800">
                    {editingId === comment._id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full bg-dark-card border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                          rows="3"
                        />
                        <div className="flex space-x-2 justify-end">
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                          <Button size="sm" onClick={() => handleEdit(comment._id)} loading={loading}>Save</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{comment.owner?.fullname || 'Unknown User'}</h4>
                          <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                      </>
                    )}
                  </div>

                  {isAuthenticated && isOwner(comment) && !editingId && (
                    <div className="flex space-x-4 mt-2 ml-4">
                      <button
                        onClick={() => startEdit(comment)}
                        className="text-xs text-slate-500 hover:text-primary-400 flex items-center transition-colors"
                      >
                        <FiEdit2 className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="text-xs text-slate-500 hover:text-red-400 flex items-center transition-colors"
                      >
                        <FiTrash2 className="mr-1" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
