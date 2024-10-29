// "use client"

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Mail, Loader2 } from 'lucide-react'
// import { useForm } from 'react-hook-form'

// export function AuthForm() {
//   const [email, setEmail] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [message, setMessage] = useState('')
//   const router = useRouter()

//   const form = useForm()

//   const handleSubmit = form.handleSubmit(async (data) => {
//     console.log(data)
//   })

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle>Sign In</CardTitle>
//           <CardDescription>Enter your email to receive a magic link</CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="you@example.com"
//                   required
//                   {...form.register('email')}
//                 />
//               </div>
//               {error && (
//                 <Alert variant="destructive">
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button className="w-full" type="submit" disabled={isLoading}>
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Sending Magic Link...
//                 </>
//               ) : (
//                 <>
//                   <Mail className="mr-2 h-4 w-4" />
//                   Send Magic Link
//                 </>
//               )}
//             </Button>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   )
// }

// Backend code remains the same...

// Frontend (Next.js 14) Implementation
// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import api from '@/services/api';

type FormData = {
  email: string;
};

export function AuthForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data); // Your console.log is preserved
    setLoading(true);
    
    try {
      const response = await api.post('/auth/magic-link', { email: data.email });
      
      if (response.status === 200) {
        setMessage('Check your email for the magic link!');
      } else {
        throw new Error('Failed to send magic link');
      }
    } catch (error) {
      setMessage('Error sending magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        <form onSubmit={onSubmit}>
          <input
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border rounded mb-4"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-4">{errors.email.message}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}

// Rest of the code remains the same...