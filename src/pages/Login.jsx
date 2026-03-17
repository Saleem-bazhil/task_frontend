import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api/Api';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .min(4, 'Password too short')
    .required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Welcome Back
        </h2>

        <p className="text-center text-sm text-gray-600">
          Please enter your details to sign in
        </p>

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await api.post('/user/login/', {
                username: values.username,
                password: values.password,
              });

              localStorage.setItem('token', res.data.access);
              alert('Login successful');
              console.log(res.data);
              navigate('/app');
            } catch (err) {
              console.error(err);

              if (axios.isAxiosError(err)) {
                if (err.response?.status === 400) {
                  alert('Invalid credentials');
                } else if (err.response?.status === 404) {
                  alert('Login endpoint not found. Check the backend URL and route.');
                } else {
                  alert('Unable to sign in right now. Please try again.');
                }
              } else {
                alert('Unexpected error occurred while signing in.');
              }
            }

            setSubmitting(false);
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <Field
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.username && touched.username
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="........"
                  className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password && touched.password
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-md px-4 py-2 font-medium text-white ${
                  isSubmitting
                    ? 'cursor-not-allowed bg-blue-400'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
