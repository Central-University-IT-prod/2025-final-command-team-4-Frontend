import { useCoworkStore } from '@/entity/coworks';
import { useUserStore } from '@/entity/user';
import { auth, coworkingApi } from '@/shared/api';
import { CoworkingList } from '@/shared/ui/CoworkingList';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { useEffect, useMemo } from 'react';
import { FaLocationArrow } from 'react-icons/fa6';
import { Link } from 'react-router';

export const Header = () => {
  const { user, avatar } = useUserStore();
  const { coworks, setCoworks } = useCoworkStore();

  const avatarUrl = useMemo(() => {
    if (!avatar) return '';
    return URL.createObjectURL(avatar);
  }, [avatar]);

  useEffect(() => {
    coworkingApi.findAll(auth).then(setCoworks);
  }, []);

  return (
    <header className='flex justify-around items-center gap-2 py-5 px-2'>
      <div className='flex items-center gap-6'>
        <Link to='/' className='text-3xl font-medium'>
          BookIT
        </Link>
        <div className='flex text-center items-center gap-1 text-lg max-md:hidden'>
          <FaLocationArrow />
          <p>Санкт-Петербург</p>
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <CoworkingList coworks={coworks} />
        <Link to='/profile'>
          <Avatar className='w-10 h-10'>
            <AvatarImage src={avatarUrl || '/vite.svg'} />
            <AvatarFallback>
              {user?.firstName?.at(0)}
              {user?.lastName?.at(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
};
