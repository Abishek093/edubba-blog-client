import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../components/common/NavBar";
import axiosInstance from '../store/services/axiosInstance';

interface BlogData {
  _id: string;
  title: string;
  brief: string;
  content: string;
  imageUrl?: string;
  userId: string;
  tags: string[];
  author: string;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const BlogPage = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/blogs/${blogId}`);
        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog');
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  // Format date
  const formatDate = (dateString?: Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Calculate read time
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-red-500 text-center">
            {error || 'Blog not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
          {/* Header Image */}
          <div className="w-full h-80 relative">
            <img 
              src={blog.imageUrl || "/api/placeholder/800/400"} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Blog Content Container */}
          <div className="p-6 md:p-8">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
            
            {/* Meta info */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center">
                <img 
                  src="/api/placeholder/50/50" 
                  alt={blog.author} 
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{blog.author}</p>
                  <p className="text-xs text-gray-500">{formatDate(blog.createdAt)}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {calculateReadTime(blog.content)}
              </div>
            </div>
            
            {/* Brief/Summary */}
            <div className="text-lg text-gray-600 mb-6 font-medium italic">
              {blog.brief}
            </div>
            
            {/* Main Content - rendered as HTML */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            
            {/* Back Button */}
            <div className="mt-8">
              <a 
                href="/" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to blogs
              </a>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default BlogPage;