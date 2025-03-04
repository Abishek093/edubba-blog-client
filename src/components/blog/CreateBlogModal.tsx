import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getPresignedUrl, uploadImageToS3 } from '../../utils/imageUploadHelper';
import axiosInstance from "../../store/services/axiosInstance";
import { toast } from "sonner";

interface BlogData {
  _id?: string;
  title: string;
  brief: string;
  content: string;
  tags: string[];
  imageUrl: string;
}

interface CreateBlogModalProps {
  onClose: () => void;
  userId: string;
  username: string;
  isEditing?: boolean;
  blogData?: BlogData;
}

// Yup validation schema
const validationSchema = Yup.object({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters")
    .required("Title is required"),
  brief: Yup.string()
    .min(10, "Brief must be at least 10 characters")
    .max(250, "Brief cannot exceed 250 characters")
    .required("Brief is required"),
  content: Yup.string()
    .min(50, "Content must be at least 50 characters")
    .max(5000, "Content cannot exceed 5000 characters")
    .required("Content is required"),
  imageUrl: Yup.string()
    .required("Cover image is required"),
  tags: Yup.array()
    .of(Yup.string().max(50, "Each tag cannot exceed 50 characters"))
    .min(1, "At least one tag is required"),
});

// Default tag options
const DEFAULT_TAGS = [
  "Physics & Mathematics",
  "Innovation",
  "Space",
  "Technology"
];

const CreateBlogModal: React.FC<CreateBlogModalProps> = ({
  onClose,
  userId,
  username,
  isEditing = false,
  blogData,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentTag, setCurrentTag] = useState("");
  const [showDefaultTags, setShowDefaultTags] = useState(true);

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      title: "",
      brief: "",
      content: "",
      tags: [] as string[],
      imageUrl: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let imageUrl = values.imageUrl;

        // Upload new image if selected
        if (selectedImage) {
          const fileType = selectedImage.type.split('/')[1] || 'jpeg';
          const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3008/api';
          const { uploadUrl, key } = await getPresignedUrl(userId, fileType, apiUrl + '/blogs/');
          await uploadImageToS3(uploadUrl, selectedImage);
          const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME || 'your-bucket-name';
          const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';
          imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
        }

        const blogDataToSubmit = {
          title: values.title,
          brief: values.brief,
          content: values.content,
          tags: values.tags,
          userId,
          author: username,
          imageUrl,
        };

        if (isEditing && blogData?._id) {
          await axiosInstance.put(`/blogs/${blogData._id}`, blogDataToSubmit);
          toast.success("Blog updated successfully");
        } else {
          await axiosInstance.post('/blogs/create-blog', blogDataToSubmit);
          toast.success("Blog created successfully");
        }

        onClose();
      } catch (err) {
        console.error("Error saving blog:", err);
        toast.error(`Failed to ${isEditing ? 'update' : 'create'} blog. Please try again.`);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Populate form with existing data if editing
  useEffect(() => {
    if (isEditing && blogData) {
      formik.setValues({
        title: blogData.title || "",
        brief: blogData.brief || "",
        content: blogData.content || "",
        tags: blogData.tags || [],
        imageUrl: blogData.imageUrl || "",
      });
      if (blogData.imageUrl) {
        setPreviewImage(blogData.imageUrl);
      }
    }
  }, [isEditing, blogData]);

  useEffect(() => {
    // Hide default tags if user has already selected tags
    if (formik.values.tags.length > 0) {
      setShowDefaultTags(false);
    }
  }, [formik.values.tags]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewImage(preview);
      formik.setFieldValue("imageUrl", preview); // Update formik value
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formik.values.tags.includes(currentTag.trim())) {
      const newTags = [...formik.values.tags, currentTag.trim()];
      formik.setFieldValue("tags", newTags);
      setCurrentTag("");
      setShowDefaultTags(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = formik.values.tags.filter((tag) => tag !== tagToRemove);
    formik.setFieldValue("tags", newTags);
    if (newTags.length === 0) {
      setShowDefaultTags(true);
    }
  };

  const handleSelectDefaultTag = (tag: string) => {
    if (!formik.values.tags.includes(tag)) {
      const newTags = [...formik.values.tags, tag];
      formik.setFieldValue("tags", newTags);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Edit Blog" : "Create New Blog"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="px-6 py-4">
          {formik.submitCount > 0 && Object.keys(formik.errors).length > 0 && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              Please fill the required fields.
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              {...formik.getFieldProps("title")}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                formik.touched.title && formik.errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter your blog title"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.title}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="brief" className="block text-sm font-medium text-gray-700 mb-1">
              Brief Description
            </label>
            <input
              type="text"
              id="brief"
              {...formik.getFieldProps("brief")}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                formik.touched.brief && formik.errors.brief
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="A short description of your blog"
            />
            {formik.touched.brief && formik.errors.brief && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.brief}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              {...formik.getFieldProps("content")}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 min-h-[200px] ${
                formik.touched.content && formik.errors.content
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Write your blog content here..."
            />
            {formik.touched.content && formik.errors.content && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.content}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer text-sm font-medium"
              >
                {isEditing ? "Change Image" : "Select Image"}
              </label>
              {previewImage && (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-16 w-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setPreviewImage(null);
                      formik.setFieldValue("imageUrl", "");
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            {formik.touched.imageUrl && formik.errors.imageUrl && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.imageUrl}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            
            {/* Selected tags display */}
            <div className="flex flex-wrap gap-2 mb-3">
              {formik.values.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            
            {/* Default tag options */}
            {showDefaultTags && (
              <div className="mb-3">
                <p className="text-sm text-gray-500 mb-2">Choose from default tags or add custom tags below:</p>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_TAGS.map((tag, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectDefaultTag(tag)}
                      className={`px-3 py-1 border border-gray-300 hover:bg-blue-50 hover:border-blue-300 text-gray-700 text-sm font-medium rounded-full ${
                        formik.values.tags.includes(tag) ? "bg-blue-50 border-blue-300" : ""
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Custom tag input */}
            <div className="flex">
              <input
                type="text"
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add custom tag (press Enter or click Add)"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {formik.touched.tags && formik.errors.tags && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.tags}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              disabled={formik.isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (isEditing ? "Updating..." : "Publishing...") : (isEditing ? "Update" : "Publish")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogModal;