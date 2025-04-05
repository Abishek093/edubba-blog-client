// FeaturedArticle.tsx (updated)
import React from 'react';
// import axiosInstance from '../../store/services/axiosInstance';
import { useBlogs } from '../../hooks/useBlogs';

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


const FeaturedArticle: React.FC = () => {
  // const [featuredBlog, setFeaturedBlog] = useState<Blog | null>(null);
  // const [loading, setLoading] = useState(true);
  const { blogs, loading } = useBlogs();
  const featuredBlog: Blog | undefined = blogs[0];

  // useEffect(() => {
  //   const fetchFeaturedBlog = async () => {
  //     try {
  //       setLoading(true);
  //       // Get all blogs and take the first one as featured
  //       const response = await axiosInstance.get('/blogs/get-blogs');
  //       if (response.data && response.data.length > 0) {
  //         setFeaturedBlog(response.data[0]);
  //       }
  //       setLoading(false);
  //     } catch (err) {
  //       console.error('Error fetching featured blog:', err);
  //       setLoading(false);
  //     }
  //   };

  //   fetchFeaturedBlog();
  // }, []);

  // // Format date
  // const formatDate = (dateString?: Date) => {
  //   if (!dateString) return '';
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  // };

  const formatDate = (dateString?: Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading featured article...</div>;
  }

  if (!featuredBlog) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img
            src={featuredBlog.imageUrl || "/api/placeholder/600/400"}
            alt={featuredBlog.title}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
              {featuredBlog.tags[0] || "Featured"}
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-2">{featuredBlog.title}</h2>
            <p className="text-gray-600 mb-4">{featuredBlog.brief}</p>
          </div>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <img
                src={featuredBlog.authorDetails?.profilePicture || "/api/placeholder/40/40"}
                alt={featuredBlog.author}
                className="w-6 h-6 rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{featuredBlog.author}</p>
                <p className="text-xs text-gray-500">{formatDate(featuredBlog.createdAt)}</p>
              </div>
            </div>
            <a
              href={`/blog/${featuredBlog._id}`}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center transition-colors duration-300"
            >
              Read Article
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;