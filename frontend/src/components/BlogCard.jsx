import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  // Create excerpt from content (first 150 characters)
  const excerpt = blog.content
    ? blog.content.substring(0, 150) + (blog.content.length > 150 ? '...' : '')
    : '';

  // Get author name
  const authorName = blog.author?.fullname || 'Unknown Author';

  return (
    <Link
      to={`/blog/${blog._id}`}
      className="block bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors border border-gray-800"
    >
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
        <div className="flex items-center justify-between">
          <p className="text-gray-300 text-sm">
            By <span className="font-medium">{authorName}</span>
          </p>
          <span className="text-gray-500 text-xs">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;

