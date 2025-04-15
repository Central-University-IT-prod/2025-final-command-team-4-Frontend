import { useUserStore } from '@/entity/user';
import { accountService, auth } from '@/shared/api';
import { Header } from '@/widgets/header';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

export function Layout() {
  const { setUser, fetchAvatar } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    accountService
      .getCurrentUserProfile(auth)
      .then(setUser)
      .catch(() => {
        navigate('/sign-in');
      })
      .then(fetchAvatar);
  }, []);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
