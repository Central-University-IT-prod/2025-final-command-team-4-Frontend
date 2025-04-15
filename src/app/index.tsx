import { AdminPage } from '@/pages/AdminPage';
import { BookCoworkPage } from '@/pages/BookCoworkPage';
import { CoworkingPage } from '@/pages/CoworkingPage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { RegisterPage } from '@/pages/RegisterPage';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from './Layout';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path='coworking/:id' element={<CoworkingPage />} />
          <Route path='coworking/:id/book' element={<BookCoworkPage />} />
          <Route index element={<HomePage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/admin' element={<AdminPage />} />
        </Route>
        <Route path='/sign-in' element={<LoginPage />} />
        <Route path='/sign-up' element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
};
