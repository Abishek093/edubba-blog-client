import React, { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useLoginMutation } from '../../store/services/authApi';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .trim()
    .required('Password is required'),
  rememberMe: Yup.boolean(),
});

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [login, { isLoading, error, isSuccess, data }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await login({
          email: values.email.trim(),
          password: values.password.trim(),
        }).unwrap();

        Cookies.set('accessToken', response.accessToken || '', { expires: 1 / 96 });
        Cookies.set('refreshToken', response.refreshToken || '', { expires: 7 });

        navigate('/');
      } catch (err) {
        console.error('Login failed:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form className="flex flex-col flex-1" onSubmit={formik.handleSubmit}>
      <h2 className="text-2xl font-bold mb-8 text-[#2E2E2E]">Welcome Back</h2>

      {/* Email */}
      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 font-medium text-[#2E2E2E]">Email Address</label>
        <div className="relative flex items-center">
          <FiMail className="absolute left-3 text-[#2E2E2E] opacity-50" />
          <input
            type="email"
            id="email"
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
        <label htmlFor="password" className="block mb-2 font-medium text-[#2E2E2E]">Password</label>
        <div className="relative flex items-center">
          <FiLock className="absolute left-3 text-[#2E2E2E] opacity-50" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            {...formik.getFieldProps('password')}
            className={`w-full py-3 px-10 border ${formik.touched.password && formik.errors.password ? 'border-[#B00020]' : 'border-[#D0D0D0]'
              } rounded-md bg-[#F9F9F9] text-base text-[#2E2E2E] transition-all duration-300 focus:outline-none focus:border-[#E0C097] focus:shadow-[0_0_0_2px_rgba(224,192,151,0.3)]`}
            placeholder="Enter your password"
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

      {/* Remember Me */}
      {/* <div className="mb-5 flex items-center">
        <input
          type="checkbox"
          id="rememberMe"
          {...formik.getFieldProps('rememberMe')}
          className="w-4 h-4 border border-gray-300 rounded text-[#1B1F3B] focus:ring focus:ring-[#E0C097] cursor-pointer"
        />
        <label htmlFor="rememberMe" className="ml-2 text-sm text-[#2E2E2E] cursor-pointer">Remember Me</label>
      </div> */}

      {isSuccess && (
        <p className="text-sm text-green-600 mb-5">Login successful! Welcome back, {data?.username}.</p>
      )}
      {error && (
        <p className="text-sm text-[#B00020] mb-5">
          {('data' in error && (error.data as any)?.message) || 'Login failed. Please try again.'}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || formik.isSubmitting}
        className={`py-3.5 bg-[#1B1F3B] text-white border-none rounded-md text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-[#800020] mb-5 ${(isLoading || formik.isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading || formik.isSubmitting ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;
