import { useState, useEffect } from 'react';
import { blogAPI } from '../services/api';
import BlogCard from '../components/BlogCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to BlogApp
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover amazing stories, share your thoughts, and connect with a community of writers and readers.
          </p>
        </div>
      </section>

      {/* Blogs Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-white text-xl">Loading blogs...</div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-400 text-xl mb-4">{error}</div>
            <button
              onClick={fetchBlogs}
              className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-xl">No blogs available yet.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;

