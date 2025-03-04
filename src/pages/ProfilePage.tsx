import { useState } from "react";
import Navbar from "../components/common/NavBar";
import UserProfileHeader from "../components/blog/UserProfileHeader";
import UserBlogsList from "../components/blog/UserBlogsList";
import CreateBlogModal from "../components/blog/CreateBlogModal";
import EditProfileModal from "../components/profile/EditProfileModal";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { useGetUserQuery } from "../store/services/authApi";
import Cookies from "js-cookie";

const ProfilePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const accessToken = Cookies.get('accessToken');
  
  const { data: userData, refetch } = useGetUserQuery(undefined, {
    skip: !accessToken
  });
  
  if (!isAuthenticated && !accessToken) {
    navigate("/auth");
    return null;
  }
  
  const currentUser = user || userData;

  const handleProfileUpdate = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <UserProfileHeader 
          user={currentUser} 
          onCreateBlogClick={() => setIsCreateModalOpen(true)}
          onEditProfileClick={() => setIsEditProfileModalOpen(true)}
          isCurrentUser={true}
        />
        
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Articles</h2>
          <UserBlogsList userId={currentUser?._id || ""} />
        </div>
      </main>
      
      {isCreateModalOpen && (
        <CreateBlogModal 
          onClose={() => setIsCreateModalOpen(false)}
          userId={currentUser?._id || ""}
          username={currentUser?.username || ""}
        />
      )}

      {isEditProfileModalOpen && (
        <EditProfileModal
          user={currentUser}
          onClose={() => setIsEditProfileModalOpen(false)}
          onUpdateSuccess={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default ProfilePage;