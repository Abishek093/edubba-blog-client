import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase, FiInfo } from 'react-icons/fi';
import { useSignupMutation, SignupRequest } from '../../store/services/authApi';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';

const validationSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .required('Username is required'),
  email: Yup.string()
    .trim()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .trim()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      'Password must contain uppercase, lowercase, numbers, and special characters'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Confirm Password is required'),
  profilePicture: Yup.string()
    .trim()
    .url('Profile picture must be a valid URL')
    .optional(),
  profession: Yup.string()
    .trim()
    .max(50, 'Profession cannot exceed 50 characters')
    .optional(),
  bio: Yup.string()
    .trim()
    .max(500, 'Bio cannot exceed 500 characters')
    .optional(),
});

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      profilePicture: '',
      profession: '',
      bio: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const userData: SignupRequest['userData'] = {
        username: values.username,
        email: values.email,
        password: values.password,
        ...(values.profilePicture && { profilePicture: values.profilePicture }),
        ...(values.profession && { profession: values.profession }),
        ...(values.bio && { bio: values.bio }),
      };

      try {
        const response = await signup({ userData }).unwrap();
        toast.success('Signup successful! Please verify your email.');
        navigate('/otp', { state: { email: response.email } });
      } catch (err: any) {
        console.error('Signup failed:', err);
        toast.error(err.data?.message || 'Signup failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form className="flex flex-col flex-1" onSubmit={formik.handleSubmit}>
      <h2 className="text-2xl font-bold mb-8 text-[#2E2E2E]">Create Your Account</h2>

      {/* Username */}
      <div className="mb-5">
        <label htmlFor="username" className="block mb-2 font-medium text-[#2E2E2E]">Username</label>
        <div className="relative flex items-center">
          <FiUser className="absolute left-3 text-[#2E2E2E] opacity-50" />
          <input
            type="text"
            id="username"
            {...formik.getFieldProps('username')}
            className={`w-full py-3 px-10 border ${formik.touched.username && formik.errors.username ? 'border-[#B00020]' : 'border-[#D0D0D0]'
              } rounded-md bg-[#F9F9F9] text-base text-[#2E2E2E] transition-all duration-300 focus:outline-none focus:border-[#E0C097] focus:shadow-[0_0_0_2px_rgba(224,192,151,0.3)]`}
            placeholder="Enter your username"
          />
        </div>
        {formik.touched.username && formik.errors.username && (
          <p className="text-sm text-[#B00020] mt-1">{formik.errors.username}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-5">
        <label htmlFor="signup-email" className="block mb-2 font-medium text-[#2E2E2E]">Email Address</label>
        <div className="relative flex items-center">
          <FiMail className="absolute left-3 text-[#2E2E2E] opacity-50" />
          <input
            type="email"
            id="signup-email"
            {...formik.getFieldProps('email')}
            className={`w-full py-3 px-10 border ${formik.touched.email && formik.errors.email ? 'border-[#B00020]' : 'border-[#D0D0D0]'
              } rounded-md bg-[#F9F9F9] text-base text-[#2E2E2E] transition-all duration-300 focus:outline-none focus:border-[#E0C097] focus:shadow-[0_0_0_2px_rgba(224,192,151,0.3)]`}
            placeholder="your@email.com"
          />
        </div>
        {formik.touched.email && formik.errors.email && (
          <p className="text-sm text-[#B00020] mt-1">{formik.errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="mb-5">
        <label htmlFor="signup-password" className="block mb-2 font-medium text-[#2E2E2E]">Password</label>
        <div className="relative flex items-center">
          <FiLock className="absolute left-3 text-[#2E2E2E] opacity-50" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="signup-password"
            {...formik.getFieldProps('password')}
            className={`w-full py-3 px-10 border ${formik.touched.password && formik.errors.password ? 'border-[#B00020]' : 'border-[#D0D0D0]'
              } rounded-md bg-[#F9F9F9] text-base text-[#2E2E2E] transition-all duration-300 focus:outline-none focus:border-[#E0C097] focus:shadow-[0_0_0_2px_rgba(224,192,151,0.3)]`}
            placeholder="Create a strong password"
          />
          <button
            type="button"
            className="absolute right-3 text-[#2E2E2E] opacity-60 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="text-sm text-[#B00020] mt-1">{formik.errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="mb-5">
        <label htmlFor="confirmPassword" className="block mb-2 font-medium text-[#2E2E2E]">Confirm Password</label>
        <div className="relative flex items-center">
          <FiLock className="absolute left-3 text-[#2E2E2E] opacity-50" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            {...formik.getFieldProps('confirmPassword')}
            className={`w-full py-3 px-10 border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-[#B00020]' : 'border-[#D0D0D0]'
              } rounded-md bg-[#F9F9F9] text-base text-[#2E2E2E] transition-all duration-300 focus:outline-none focus:border-[#E0C097] focus:shadow-[0_0_0_2px_rgba(224,192,151,0.3)]`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            className="absolute right-3 text-[#2E2E2E] opacity-60 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="text-sm text-[#B00020] mt-1">{formik.errors.confirmPassword}</p>
        )}
      </div>

      {/* Profession */}
      <div className="mb-5">
        <label htmlFor="profession" className="block mb-2 font-medium text-[#2E2E2E]">Profession</label>
        <div className="relative flex items-center">
          <FiBriefcase className="absolute left-3 text-[#2E2E2E] opacity-50" />
          <input
            type="text"
            id="profession"
            {...formik.getFieldProps('profession')}
            className={`w-full py-3 px-10 border ${formik.touched.profession && formik.errors.profession ? 'border-[#B00020]' : 'border-[#D0D0D0]'
              } rounded-md bg-[#F9F9F9] text-base text-[#2E2E2E] transition-all duration-300 focus:outline-none focus:border-[#E0C097] focus:shadow-[0_0_0_2px_rgba(224,192,151,0.3)]`}
            placeholder="Enter your profession (optional)"
          />
        </div>
        {formik.touched.profession && formik.errors.profession && (
          <p className="text-sm text-[#B00020] mt-1">{formik.errors.profession}</p>
        )}
      </div>

      {/* Bio */}
      <div className="mb-5">
        <label htmlFor="bio" className="block mb-2 font-medium text-[#2E2E2E]">Bio</label>
        <div className="relative flex items-center">
          <FiInfo className="absolute left-3 top-3 text-[#2E2E2E] opacity-50" />
          <textarea
            id="bio"
            {...formik.getFieldProps('bio')}
            className={`w-full py-3 px-10 border ${formik.touched.bio && formik.errors.bio ? 'border-[#B00020]' : 'border-[#D0D0D0]'
              } rounded-md bg-[#F9F9F9] text-base text-[#2E2E2E] transition-all duration-300 focus:outline-none focus:border-[#E0C097] focus:shadow-[0_0_0_2px_rgba(224,192,151,0.3)] min-h-[100px]`}
            placeholder="Tell us about yourself (optional)"
          />
        </div>
        {formik.touched.bio && formik.errors.bio && (
          <p className="text-sm text-[#B00020] mt-1">{formik.errors.bio}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || formik.isSubmitting}
        className={`py-3.5 bg-[#1B1F3B] text-white border-none rounded-md text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-[#800020] mb-5 ${(isLoading || formik.isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading || formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};

export default SignupForm;