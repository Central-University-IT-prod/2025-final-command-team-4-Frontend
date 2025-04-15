import { accountService, auth } from '@/shared/api';
import {
  AccountProfileResponse,
  CoworkingAccountBookingResponse
} from '@/shared/api/generated';
import { useState, useEffect } from 'react';

export const SocialUser = ({ b }: { b: CoworkingAccountBookingResponse }) => {
  const [user, setUser] = useState<AccountProfileResponse | null>(null);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (!b.login) return;

    (async () => {
      const user = await accountService.getProfile({ login: b.login }, auth);
      setUser(user);

      const avatar = await accountService.downloadAvatar(
        { login: user.login },
        auth
      );

      const a = URL.createObjectURL(avatar) || '/vite.svg';
      console.log(a);
      setAvatar(a);
    })();
  }, []);

  return (
    <div key={b.login} className='flex flex-col gap-1'>
      <div>
        Забронировал: {user?.firstName} {user?.lastName}
      </div>
      <div>
        С {b.from.toLocaleString()} по {b.to.toLocaleTimeString()}
      </div>
    </div>
  );
};
