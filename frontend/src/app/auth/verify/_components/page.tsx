'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/services/api';

export function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('No token provided');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await api.get(`/auth/verify?token=${token}`);
        if (response.status === 200) {
          const user = await response.data;
          // Store user data in your preferred state management solution
          localStorage.setItem('user', JSON.stringify(user));
          router.push('/dashboard'); // Redirect to dashboard
        } else {
          throw new Error('Invalid token');
        }
      } catch (error) {
        setError('Invalid or expired token');
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p>Verifying your login...</p>
        )}
      </div>
    </div>
  );
}