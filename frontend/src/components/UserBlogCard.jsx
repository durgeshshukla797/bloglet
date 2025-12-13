import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const UserBlogCard = ({ blog, onDelete }) => {
  const navigate = useNavigate();

  // Create excerpt from content (first 150 characters)
  const excerpt = blog.content
    ? blog.content.substring(0, 150) + (blog.content.length > 150 ? '...' : '')
    : '';

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      onDelete(blog._id);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/blog/${blog._id}/edit`);
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors border border-gray-800 relative group">
      {blog.coverImage && (
        <div className="w-full h-64 overflow-hidden bg-gray-800">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{excerpt}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500 text-xs">
            {new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-800">
          <Link
            to={`/blog/${blog._id}`}
            className="flex-1 text-center bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors text-sm"
          >
            View
          </Link>
          <button
            onClick={handleEdit}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
            title="Edit Blog"
          >
            <FiEdit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm"
            title="Delete Blog"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserBlogCard;

