import React, { useEffect, useState } from 'react';
import axiosInstance from '../../store/services/axiosInstance';
import Pagination from './Pagination';
import BlogCard from './BlogCard';

interface Blog {
  _id: string;
  title: string;
  brief: string;
  content: string;
  imageUrl?: string;
  userId: string;
  tags: string[];
  author: string;
  authorDetails?: {
    profilePicture?: string;
    profession?: string;
  };
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BlogListProps {
  selectedCategory?: string | null;
}

const BlogList: React.FC<BlogListProps> = ({ selectedCategory }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const blogsPerPage = 9; 

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/blogs/get-blogs');
        
        if (response.data.blogs && response.data.totalCount) {
          setBlogs(response.data.blogs);
          setTotalBlogs(response.data.totalCount);
        } else {
          setBlogs(response.data);
          setTotalBlogs(response.data.length);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    
    let filtered = blogs;
    
    if (selectedCategory) {
      filtered = blogs.filter(blog => 
        blog.tags.some(tag => {
          const normalizedTag = tag.toLowerCase();
          const normalizedCategory = selectedCategory.toLowerCase();
          
          return normalizedTag === normalizedCategory || 
                 normalizedTag === normalizedCategory.replace(' & ', ' and ') ||
                 normalizedTag.includes(normalizedCategory) ||
                 normalizedCategory.includes(normalizedTag);
        })
      );
    }
    
    setFilteredBlogs(filtered);
    setTotalBlogs(filtered.length);
  }, [selectedCategory, blogs]);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading blogs...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (filteredBlogs.length === 0) {
    return (
      <div className="p-4 text-center">
        {selectedCategory 
          ? `No blogs available in the "${selectedCategory}" category.` 
          : "No blogs available at the moment."}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBlogs.map(blog => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-4">
        Showing {Math.min(blogsPerPage, filteredBlogs.length - (currentPage - 1) * blogsPerPage)} of {totalBlogs} blogs
      </div>
    </div>
  );
};

export default BlogList;