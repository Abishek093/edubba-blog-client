import React, { useState, useEffect } from "react";
import axiosInstance from "../../store/services/axiosInstance";
import { toast } from "sonner";
import CreateBlogModal from "./CreateBlogModal";

interface BlogItemProps {
  _id: string;
  title: string;
  brief: string;
  imageUrl: string;
  createdAt: string;
  tags: string[];
  content: string;
  author: string;
  userId: string;
}

interface UserBlogsListProps {
  userId: string;
}

const UserBlogsList: React.FC<UserBlogsListProps> = ({ userId }) => {
  const [blogs, setBlogs] = useState<BlogItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogItemProps | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/blogs/user-blogs/${userId}`);
      console.log("Response: ",response)
      setBlogs(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching user blogs:", err);
      setError("Failed to load your blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserBlogs();
    }
  }, [userId]);

  const handleEdit = (blog: BlogItemProps) => {
    setEditingBlog(blog);
  };

  const handleDelete = async (blogId: string) => {
    try {
      await axiosInstance.delete(`/blogs/${blogId}`);
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogId));
      toast.success("Blog deleted successfully");
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Error deleting blog:", err);
      toast.error("Failed to delete blog. Please try again.");
    }
  };

  const handleCloseEditModal = () => {
    setEditingBlog(null);
    // Refresh the list to show updated blog
    fetchUserBlogs();
  };

  const BlogItem: React.FC<{ blog: BlogItemProps }> = ({ blog }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <img 
            src={blog.imageUrl || "https://via.placeholder.com/400x250"} 
            alt={blog.title} 
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h3>
            <div className="flex space-x-2">
              <button 
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleEdit(blog)}
                aria-label="Edit blog"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              {deleteConfirmId === blog._id ? (
                <div className="flex items-center space-x-2">
                  <button 
                    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 bg-red-100 rounded"
                    onClick={() => handleDelete(blog._id)}
                    aria-label="Confirm delete"
                  >
                    Confirm
                  </button>
                  <button 
                    className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1 bg-gray-100 rounded"
                    onClick={() => setDeleteConfirmId(null)}
                    aria-label="Cancel delete"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => setDeleteConfirmId(blog._id)}
                  aria-label="Delete blog"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-600 mt-2 mb-4">{blog.brief}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags && blog.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center mt-auto">
            <div className="text-sm text-gray-500">
              Published on {new Date(blog.createdAt).toLocaleDateString("en-US", { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Blogs</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <BlogItem key={blog._id} blog={blog} />
        ))
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No blogs yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first blog post.
          </p>
        </div>
      )}

      {editingBlog && (
        <CreateBlogModal 
          onClose={handleCloseEditModal}
          userId={userId}
          username={editingBlog.author}
          isEditing={true}
          blogData={editingBlog}
        />
      )}
    </div>
  );
};

export default UserBlogsList;