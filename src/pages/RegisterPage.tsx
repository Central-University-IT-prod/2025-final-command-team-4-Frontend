import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountService } from '@/shared/api';
import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Link } from 'react-router';
import { toast } from 'sonner';

import { z } from 'zod';

const schema = z.object({
  firstName: z.string().nonempty('Поле обязательно для заполнения'),
  lastName: z.string().nonempty('Поле обязательно для заполнения'),
  login: z
    .string()
    .nonempty('Поле обязательно для заполнения')
    .min(2, 'Логин должен содержать минимум 2 символа')
    .regex(/^[a-zA-Z]+$/, 'Логин должен содержать только латинские буквы'),
  password: z
    .string()
    .nonempty('Поле обязательно для заполнения')
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
    .regex(/[a-zA-Z]/, 'Пароль должен содержать хотя бы одну букву')
});

type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      login: '',
      password: ''
    }
  });

  const onRegister = async (data: FormData) => {
    const res = await accountService
      .signUp({
        accountSignUpRequest: { ...data, isAdmin: false }
      })
      .catch(() => {
        toast('Ошибка регистрации');
      });

    if (!res) return;
    localStorage.setItem('token', res.accessToken);

    if (res.profile.isAdmin) {
      location.href = '/admin';
    } else {
      location.href = '/';
    }
  };

  return (
    <main className='flex justify-center items-center h-screen'>
      <div className={cn('flex flex-col gap-6 min-w-[350px]')}>
        <Card>
          <CardHeader>
            <CardTitle>Регистрация</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onRegister)}>
              <div className='flex flex-col gap-6 mb-2'>
                <div className='grid gap-3'>
                  <div className='flex items-center'>
                    <Label htmlFor='firstName'>Имя</Label>
                  </div>
                  <Input
                    {...register('firstName')}
                    id='firstName'
                    placeholder='Введите имя'
                  />
                  {errors.firstName && (
                    <p className='text-sm text-red-500'>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className='grid gap-3'>
                  <div className='flex items-center'>
                    <Label htmlFor='lastName'>Фамилия</Label>
                  </div>
                  <Input
                    {...register('lastName')}
                    id='lastName'
                    placeholder='Введите фамилию'
                  />
                  {errors.lastName && (
                    <p className='text-sm text-red-500'>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className='grid gap-3'>
                  <Label htmlFor='login'>Логин</Label>
                  <Input
                    {...register('login')}
                    id='login'
                    type='text'
                    placeholder='Введите логин'
                  />
                  {errors.login && (
                    <p className='text-sm text-red-500'>
                      {errors.login.message}
                    </p>
                  )}
                </div>
                <div className='grid gap-3'>
                  <div className='flex items-center'>
                    <Label htmlFor='password'>Пароль</Label>
                  </div>
                  <Input
                    {...register('password')}
                    id='password'
                    type='password'
                    placeholder='Введите пароль'
                  />
                  {errors.password && (
                    <p className='text-sm text-red-500'>
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className='flex flex-col gap-3'>
                  <Button type='submit' className='w-full'>
                    Зарегистрироваться
                  </Button>
                </div>
              </div>
              <Link to='/sign-in' className='mt-4 text-center text-sm'>
                Войти
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
