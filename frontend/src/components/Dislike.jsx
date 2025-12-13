import { useState, useEffect } from 'react';
import { FiThumbsDown } from 'react-icons/fi';
import { reactionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dislike = ({ blogId, initialCount = 0, initialDisliked = false, onUpdate }) => {
  const [disliked, setDisliked] = useState(initialDisliked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setDisliked(initialDisliked);
    setCount(initialCount);
  }, [initialDisliked, initialCount]);

  const handleDislike = async () => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    try {
      if (disliked) {
        const response = await reactionAPI.removeDislike(blogId);
        if (response.data.success) {
          const newCount = Math.max(0, count - 1);
          setDisliked(false);
          setCount(newCount);
          if (onUpdate) onUpdate(newCount, false);
        }
      } else {
        const response = await reactionAPI.dislike(blogId);
        if (response.data.success) {
          const newCount = count + 1;
          setDisliked(true);
          setCount(newCount);
          if (onUpdate) onUpdate(newCount, true);
        }
      }
    } catch (error) {
      console.error('Error toggling dislike:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDislike}
      disabled={loading || !isAuthenticated}
      className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
        disliked
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      } ${!isAuthenticated ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
      title={!isAuthenticated ? 'Please login to dislike' : disliked ? 'Remove dislike' : 'Dislike'}
    >
      <FiThumbsDown className={`w-5 h-5 ${disliked ? 'fill-current' : ''}`} />
      <span>{count}</span>
    </button>
  );
};

export default Dislike;

