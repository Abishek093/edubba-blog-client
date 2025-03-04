import React from 'react';

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

const BlogCard: React.FC<{blog: Blog}> = ({ blog }) => {
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const formatDate = (dateString?: Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
      <div className="relative">
        <img 
          src={blog.imageUrl || "/api/placeholder/400/300"} 
          alt={blog.title} 
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          {blog.tags[0] || "General"}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>{formatDate(blog.createdAt)}</span>
          <span>{calculateReadTime(blog.content)}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{blog.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{blog.brief}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={blog.authorDetails?.profilePicture || "/api/placeholder/40/40"} 
              alt={blog.author} 
              className="w-6 h-6 rounded-full"
            />
            <div className="ml-2">
              <span className="text-xs text-gray-600">by {blog.author}</span>
              {blog.authorDetails?.profession && (
                <p className="text-xs text-gray-400">{blog.authorDetails.profession}</p>
              )}
            </div>
          </div>
          <a href={`/blog/${blog._id}`} className="text-blue-500 hover:text-blue-700 text-sm font-medium">
            Read more
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;