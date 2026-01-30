import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import BlogDetails from './pages/BlogDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/blog/create" element={<CreateBlog />} />
            <Route path="/blog/:id/edit" element={<EditBlog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            {/* Fallback for About page or other links */}
            <Route path="/about" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
