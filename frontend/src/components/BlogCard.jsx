import { Link } from 'react-router-dom';
import Card from './ui/Card';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';

const BlogCard = ({ blog }) => {
  // Create excerpt from content
  const excerpt = blog.content
    ? blog.content.substring(0, 150) + (blog.content.length > 150 ? '...' : '')
    : '';

  const authorName = blog.author?.fullname || 'Unknown Author';

  // Calculate read time (rough estimate: 200 words per minute)
  const readTime = Math.max(1, Math.ceil((blog.content?.split(' ').length || 0) / 200));

  return (
    <Link to={`/blog/${blog._id}`} className="block h-full">
      <Card className="h-full flex flex-col group cursor-pointer border-slate-700/50 hover:border-primary-500/30">
        <div className="relative h-48 sm:h-56 overflow-hidden">
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <span className="text-4xl text-slate-700 font-heading font-bold opacity-30">Bloglet</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent opacity-60" />
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center text-xs text-slate-400 mb-3 space-x-3">
            <span className="flex items-center"><FiCalendar className="mr-1" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center"><FiClock className="mr-1" /> {readTime} min read</span>
          </div>

          <h3 className="text-xl font-bold font-heading text-white mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors">
            {blog.title}
          </h3>

          <p className="text-slate-400 text-sm mb-6 line-clamp-3 text-justify flex-grow leading-relaxed">
            {excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-2 border border-slate-600">
                <FiUser className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-sm font-medium text-slate-300">{authorName}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BlogCard;
