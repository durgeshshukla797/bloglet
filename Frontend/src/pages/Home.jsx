import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import BlogCard from '../components/BlogCard';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getPublicBlogs();
      if (response.data.success) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      setError('Failed to load blogs. Please try again later.');
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight">
            <span className="block text-white mb-2">Welcome to Your</span>
            <span className="bg-gradient-to-r from-primary-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Daily Inspiration
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Discover amazing stories, share your unique perspective, and connect with a community of passionate writers and readers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Reading
              </Button>
            </Link>
            <Link to="/blog/create">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto group">
                Write a Story <FiArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold font-heading text-white mb-8 border-l-4 border-primary-500 pl-4">
          Latest Stories
        </h2>

        {loading ? (
          <Loader size="lg" />
        ) : error ? (
          <div className="text-center py-20 bg-dark-card/50 rounded-xl border border-red-500/20">
            <div className="text-red-400 text-xl mb-4">{error}</div>
            <Button onClick={fetchBlogs} variant="outline">
              Try Again
            </Button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-dark-card/50 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-xl">No blogs available yet. Be the first to write one!</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <div key={blog._id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
