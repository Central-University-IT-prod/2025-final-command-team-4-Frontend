import { useUserStore } from '@/entity/user';
import { accountService, auth, conf } from '@/shared/api';
import { AccountProfilePutRequest } from '@/shared/api/generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useEffect, useMemo, useState } from 'react';
import { PurchaseHistory } from '@/shared/ui/PurchaseHistory';
import { toast } from 'sonner';
import { Link } from 'react-router';

export const ProfilePage = () => {
  const { user, avatar, fetchAvatar, setUser } = useUserStore();
  const [form, setForm] = useState<AccountProfilePutRequest>({
    firstName: '',
    lastName: '',
    birthDay: new Date('1990-01-01'),
    isPrivate: true
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      birthDay: new Date(user?.birthDay || new Date('1990-01-01')),
      isPrivate: user?.isPrivate || false
    });
  }, [user]);

  const avatarUrl = useMemo(() => {
    if (!avatar) return '';
    return URL.createObjectURL(avatar);
  }, [avatar]);

  const onAvatarUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';

    input.addEventListener('change', async e => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.set('file', file);

      const res = await fetch(conf.basePath + '/api/v1/account/avatars', {
        ...auth,
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        fetchAvatar();
      } else {
        toast('Не удалось загрузить аватар');
      }
    });

    input.click();
  };

  const onUpdate = async () => {
    const res = await accountService
      .putProfile(
        {
          accountProfilePutRequest: form
        },
        {
          headers: {
            ...auth.headers,
            'Content-Type': 'application/json'
          }
        }
      )
      .catch(e => {
        toast('Ошибка обновления профиля: ', e);
      });

    setIsOpen(false);
    if (!res) return;
    setUser(res);
  };

  return (
    <section className='flex flex-col gap-2 w-full items-center mt-6'>
      <div className='flex flex-col justify-center items-center gap-9 w-full px-5 sm:flex-row'>
        <div className='flex gap-9'>
          <Avatar className='w-28 h-28 md:w-32 md:h-32'>
            <AvatarImage src={avatarUrl || '/vite.svg'} alt={user?.firstName} />
            <AvatarFallback className='text-3xl'>
              {user?.firstName?.at(0)}
              {user?.lastName?.at(0)}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col justify-start gap-2'>
            <p className='text-2xl font-bold md:text-3xl'>
              {user?.firstName} {user?.lastName}
            </p>
            <p className='text-sm bg-gray-100 w-fit font-medium py-1 px-2 rounded-md transition duration-150 ease-in-out hover:bg-gray-200'>
              {user?.login}
            </p>
          </div>
        </div>
        <div className='flex flex-col gap-1 w-full max-w-6xl sm:max-w-1/6'>
          <Button
            className='text-sm sm:text-base w-full transition duration-150 ease-in-out hover:shadow-lg active:scale-95'
            onClick={onAvatarUpload}
          >
            Загрузить аватар
          </Button>
          <Button
            className='text-sm sm:text-base w-full transition duration-150 ease-in-out hover:shadow-lg active:scale-95'
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Редактировать
          </Button>
          {user?.isAdmin && (
            <Link className='w-full' to='/admin'>
              <Button className='w-full text-sm sm:text-base'>
                Панель управления
              </Button>
            </Link>
          )}
          <hr className='mx-auto my-1 border-t border-black w-1/2' />
          <Button
            className='text-sm text-black bg-white border-1 border-black sm:text-base w-full transition duration-200 hover:bg-gray-50 active:scale-95'
            onClick={() => {
              localStorage.removeItem('token');
              location.href = '/sign-in';
            }}
          >
            Выйти
          </Button>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактирование профиля</DialogTitle>
          </DialogHeader>
          <form
            className='flex flex-col gap-3 mt-3'
            onSubmit={e => {
              e.preventDefault();
              onUpdate();
            }}
          >
            <div className='flex flex-col gap-2'>
              <Label htmlFor='firstName'>Имя</Label>
              <Input
                required
                value={form.firstName}
                onChange={e =>
                  setForm(o => ({ ...o, firstName: e.target.value }))
                }
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='lastName'>Фамилия</Label>
              <Input
                required
                value={form.lastName}
                onChange={e =>
                  setForm(o => ({ ...o, lastName: e.target.value }))
                }
              />
            </div>
            <div className='flex gap-2'>
              <Checkbox
                id='isPrivate'
                checked={form.isPrivate}
                onCheckedChange={() =>
                  setForm(o => ({ ...o, isPrivate: !o.isPrivate }))
                }
              />
              <Label htmlFor='isPrivate'>Приватный профиль</Label>
            </div>

            <Button className='w-full'>Сохранить</Button>
          </form>
        </DialogContent>
      </Dialog>
      <PurchaseHistory />
    </section>
  );
};
