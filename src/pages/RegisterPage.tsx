import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Start managing your expenses today"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;