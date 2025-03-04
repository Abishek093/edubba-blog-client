import { Routes, Route } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import NotFound from './components/common/404/display'
import OTPVerificationPage from './components/auth/Otp'
import { HomePage } from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import { useAuthPersistence } from './hooks/useAuthPersistence'
import BlogPage from './pages/BlogPage'
import SearchPage from './pages/SearchPage'
import ProtectedAuthRoute from './middleware/ProtectedAuthRoute' 

function App() {
  useAuthPersistence();
  
  return (
    <>
      <Routes>
        <Route 
          path='/auth' 
          element={
            <ProtectedAuthRoute>
              <AuthPage/>
            </ProtectedAuthRoute>
          }
        />
        <Route 
          path='/otp' 
          element={
            <ProtectedAuthRoute>
              <OTPVerificationPage/>
            </ProtectedAuthRoute>
          }
        />
        <Route path='/' element={<HomePage/>} />
        <Route path='/profile/:userId' element={<ProfilePage/>} />
        <Route path="/blog/:blogId" element={<BlogPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App