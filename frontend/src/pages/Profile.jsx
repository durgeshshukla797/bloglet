import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import UserBlogCard from '../components/UserBlogCard';
import ProtectedRoute from '../components/ProtectedRoute';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';
import { FiPlus, FiUser, FiMail, FiCalendar } from 'react-icons/fi';

const Profile = () => {
  const { user: authUser, setUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUserProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
    fetchUserBlogs();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setUserLoading(true);
      const response = await authAPI.getCurrentUser();
      if (response.data.success) {
        setUserProfile(response.data.user);
        const updatedUser = { ...authUser, ...response.data.user };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (authUser) setUserProfile(authUser);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.getUserBlogs();
      if (response.data.success) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      setError('Failed to load your blogs. Please try again later.');
      console.error('Error fetching user blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      const response = await blogAPI.deleteBlog(blogId);
      if (response.data.success) {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
      } else {
        alert('Failed to delete blog. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert(error.response?.data?.message || 'Failed to delete blog. Please try again.');
    }
  };

  const displayUser = user || authUser;

  if (!displayUser) return null;

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        {/* User Profile Section */}
        <div className="mb-16">
          <div className="relative">
            <div className="h-48 rounded-2xl bg-gradient-to-r from-primary-900 to-indigo-900 border border-white/5 overflow-hidden">
              <div className="absolute inset-0 bg-dark-bg/20 backdrop-blur-sm" />
            </div>
            <div className="absolute -bottom-12 left-8 md:left-12 flex items-end">
              <div className="w-32 h-32 rounded-2xl bg-dark-card border-4 border-dark-bg flex items-center justify-center text-5xl font-bold font-heading text-white shadow-xl relative overflow-hidden">
                {userLoading ? (
                  <Loader size="sm" />
                ) : (
                  <span className="bg-gradient-to-br from-primary-400 to-indigo-500 bg-clip-text text-transparent">
                    {displayUser.fullname?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 pl-4 md:pl-8">
            {userLoading ? (
              <div className="h-20 animate-pulse bg-slate-800 rounded-lg max-w-sm" />
            ) : (
              <div>
                <h1 className="text-4xl font-bold font-heading text-white mb-2">{displayUser.fullname}</h1>
                <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
                  <div className="flex items-center"><FiUser className="mr-2" /> @{displayUser.username}</div>
                  <div className="flex items-center"><FiMail className="mr-2" /> {displayUser.email}</div>
                  <div className="flex items-center"><FiCalendar className="mr-2" /> Joined {new Date(displayUser.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User's Blogs Section */}
        <div>
          <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold font-heading text-white">My Stories <span className="text-slate-500 text-lg">({blogs.length})</span></h2>
            <Button onClick={() => navigate('/blog/create')}>
              <FiPlus className="mr-2" /> Write Story
            </Button>
          </div>

          {loading ? (
            <Loader size="lg" />
          ) : error ? (
            <div className="text-center py-20 bg-dark-card/30 rounded-xl border border-red-500/20">
              <div className="text-red-400 text-xl mb-4">{error}</div>
              <Button onClick={fetchUserBlogs} variant="outline">Try Again</Button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-24 bg-dark-card/30 rounded-2xl border border-slate-800 border-dashed">
              <h3 className="text-xl text-white font-medium mb-2">No stories yet</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">Share your thoughts with the world. Create your first blog post today.</p>
              <Button onClick={() => navigate('/blog/create')} size="lg">
                <FiPlus className="mr-2" /> Create Your First Story
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <div key={blog._id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <UserBlogCard
                    blog={blog}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
