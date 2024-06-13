'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(4)
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserLoginForm() {
  const router = useRouter();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: UserFormValue) => {
      const res = await fetch('http://127.0.0.1:8000/api/auth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password
        })
      });
      if (!res.ok) {
        throw new Error('Invalid credentials');
      }
      const responseData = await res.json();

      return responseData;
    },
    onSuccess: (res) => {
      toast.success('Logged in successfully');
      router.push('/dashboard');
    },
    onError: (err) => {
      toast.error('Invalid credentials');
    }
  });

  const onSubmit = async (data: UserFormValue) => {
    loginMutation.mutate(data);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your username..."
                    disabled={loginMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    disabled={loginMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={loginMutation.isPending}
            className="ml-auto w-full"
            type="submit"
          >
            Login
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span
            onClick={() => router.push('/sign-up')}
            className="cursor-pointer bg-background px-2 text-muted-foreground"
          >
            Or Sign Up
          </span>
        </div>
      </div>
    </>
  );
}
