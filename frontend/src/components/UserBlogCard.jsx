import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiEye, FiClock, FiCalendar } from 'react-icons/fi';
import Card from './ui/Card';
import Button from './ui/Button';

const UserBlogCard = ({ blog, onDelete }) => {
  const navigate = useNavigate();

  // Create excerpt from content
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
    <Card className="flex flex-col h-full group border-slate-700/50 hover:border-primary-500/30">
      <Link to={`/blog/${blog._id}`} className="block relative h-48 overflow-hidden">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <span className="text-3xl text-slate-700 font-bold opacity-30">Bloglet</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white font-medium flex items-center"><FiEye className="mr-2" /> View Story</span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center text-xs text-slate-400 mb-3 space-x-3">
          <span className="flex items-center"><FiCalendar className="mr-1" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>

        <h3 className="text-lg font-bold font-heading text-white mb-2 line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
          {excerpt}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 mt-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleEdit}
            className="w-full justify-center"
          >
            <FiEdit2 className="mr-2" /> Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            className="w-full justify-center bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20"
          >
            <FiTrash2 className="mr-2" /> Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UserBlogCard;
