import axiosInstance from '../../store/services/axiosInstance';

export interface Blog {
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

export interface BlogListResponse {
  blogs: Blog[];
  totalCount: number;
}

export const blogService = {
  // Get all blogs with pagination
  getAllBlogs: async (): Promise<BlogListResponse> => {
    const response = await axiosInstance.get('/blogs/get-blogs');
    
    // Handle both response formats
    if (response.data.blogs && response.data.totalCount) {
      return response.data;
    } else {
      return {
        blogs: response.data,
        totalCount: response.data.length
      };
    }
  },
  
  // Get single blog by ID
  getBlogById: async (blogId: string): Promise<Blog> => {
    const response = await axiosInstance.get(`/blogs/${blogId}`);
    return response.data;
  },
  
  // Get blogs by user ID
  getUserBlogs: async (userId: string): Promise<Blog[]> => {
    const response = await axiosInstance.get(`/blogs/user-blogs/${userId}`);
    return response.data;
  },
  
  // Search blogs
  searchBlogs: async (query: string): Promise<BlogListResponse> => {
    const response = await axiosInstance.get(`/blogs/search?query=${encodeURIComponent(query)}`);
    
    // Handle both response formats
    if (response.data.blogs && response.data.totalCount) {
      return response.data;
    } else {
      return {
        blogs: response.data,
        totalCount: response.data.length
      };
    }
  },
  
  // Create a new blog
  createBlog: async (blogData: Omit<Blog, '_id'>): Promise<Blog> => {
    const response = await axiosInstance.post('/blogs', blogData);
    return response.data;
  },
  
  // Update a blog
  updateBlog: async (blogId: string, blogData: Partial<Blog>): Promise<Blog> => {
    const response = await axiosInstance.put(`/blogs/${blogId}`, blogData);
    return response.data;
  },
  
  // Delete a blog
  deleteBlog: async (blogId: string): Promise<void> => {
    await axiosInstance.delete(`/blogs/${blogId}`);
  }
};