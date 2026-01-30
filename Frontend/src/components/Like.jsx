import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { reactionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Like = ({ blogId, initialCount = 0, initialLiked = false, onUpdate }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setLiked(initialLiked);
    setCount(initialCount);
  }, [initialLiked, initialCount]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    try {
      if (liked) {
        const response = await reactionAPI.removeLike(blogId);
        if (response.data.success) {
          const newCount = Math.max(0, count - 1);
          setLiked(false);
          setCount(newCount);
          if (onUpdate) onUpdate(newCount, false);
        }
      } else {
        const response = await reactionAPI.like(blogId);
        if (response.data.success) {
          const newCount = count + 1;
          setLiked(true);
          setCount(newCount);
          if (onUpdate) onUpdate(newCount, true);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading || !isAuthenticated}
      className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
        liked
          ? 'bg-red-600 text-white hover:bg-red-700'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      } ${!isAuthenticated ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
      title={!isAuthenticated ? 'Please login to like' : liked ? 'Unlike' : 'Like'}
    >
      <FiHeart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
      <span>{count}</span>
    </button>
  );
};

export default Like;

