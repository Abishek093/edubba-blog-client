import React, { useState } from "react";
import { useUpdateProfileMutation, IUserResponse, useGetPresignedUrlMutation } from "../../store/services/authApi";
import defaultProfilePic from "../../assets/profile.png";
import { getPresignedUrl, uploadImageToS3 } from "../../utils/imageUploadHelper";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface EditProfileModalProps {
  user: IUserResponse | null | undefined;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onUpdateSuccess }) => {
  const [profileImage, setProfileImage] = useState<string | null>(user?.profilePicture || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [getPresignedUrlMutation] = useGetPresignedUrlMutation();

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    profession: Yup.string(),
    bio: Yup.string(),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: any) => {
    setError("");
    try {
      let updatedProfilePicture = user?.profilePicture;

      if (imageFile && user?._id) {
        setIsUploading(true);
        try {
          const fileType = imageFile.type.split("/")[1] || "jpeg";
          const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3008/api";
          const { uploadUrl, key } = await getPresignedUrl(user._id, fileType, apiUrl + "/blogs/");
          await uploadImageToS3(uploadUrl, imageFile);
          const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME || "your-bucket-name";
          const region = import.meta.env.VITE_AWS_REGION || "us-east-1";
          updatedProfilePicture = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
        } catch (error) {
          console.error("Failed to upload image:", error);
          setError("Failed to upload profile image. Please try again.");
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      await updateProfile({
        username: values.username,
        profession: values.profession,
        bio: values.bio,
        profilePicture: updatedProfilePicture,
      }).unwrap();

      onUpdateSuccess();
      onClose();
    } catch (err: any) {
      setError(err.data?.message || "Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

        <Formik
          initialValues={{
            username: user?.username || "",
            profession: user?.profession || "",
            bio: user?.bio || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-6 flex flex-col items-center">
                <div className="relative w-24 h-24 mb-2">
                  <img src={profileImage || defaultProfilePic} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border-2 border-blue-200" />
                  <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer">📷</label>
                  <input type="file" id="profile-image" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="username">Username</label>
                <Field type="text" name="username" className="w-full p-2 border" />
                <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label htmlFor="profession">Profession</label>
                <Field type="text" name="profession" className="w-full p-2 border" />
              </div>

              <div className="mb-6">
                <label htmlFor="bio">Bio</label>
                <Field as="textarea" name="bio" className="w-full p-2 border" />
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200">Cancel</button>
                <button type="submit" disabled={isSubmitting || isUploading} className="px-4 py-2 bg-blue-600 text-white">Save Changes</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditProfileModal;
