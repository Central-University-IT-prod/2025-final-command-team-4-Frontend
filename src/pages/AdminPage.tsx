import { VerifyBook } from '@/features/book';
import { accountService, auth, bookService } from '@/shared/api';
import {
  AccountProfileResponse,
  CoworkingAccountBookResponse
} from '@/shared/api/generated';
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { useEffect, useState } from 'react';

export const AdminPage = () => {
  const [users, setUsers] = useState<AccountProfileResponse[]>([]);
  const [bookings, setBookings] = useState<CoworkingAccountBookResponse[]>([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [user, setUser] = useState<AccountProfileResponse | null>(null);
  const [selectedBooking, setSelectedBooking] =
    useState<CoworkingAccountBookResponse>();

  useEffect(() => {
    accountService.getAccounts({ page: 0, size: 10 }, auth).then(setUsers);
    bookService.getAllBookings({ page: 0, size: 100 }, auth).then(setBookings);
  }, []);

  const onEditUser = async () => {
    await accountService.updateUserProfile(
      {
        login: user?.login!,
        accountProfilePutRequest: {
          birthDay: new Date('2000-01-01'),
          firstName: user?.firstName!,
          lastName: user?.lastName!,
          isPrivate: user?.isPrivate!
        }
      },
      { headers: { ...auth.headers, 'Content-Type': 'application/json' } }
    );

    setIsOpenEditModal(false);
    accountService.getAccounts({ page: 0, size: 40 }, auth).then(setUsers);
  };

  return (
    <>
      <div className='mx-auto max-w-6xl px-4 py-6'>
        <Button className='mb-6' onClick={() => setIsOpenConfirmModal(true)}>
          Подтвердить бронь
        </Button>

        <div className='mb-8'>
          <Table className='w-full'>
            <TableCaption className='text-lg font-bold mb-4'>
              Пользователи
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='w-1/3'>Имя</TableHead>
                <TableHead className='w-1/3'>Фамилия</TableHead>
                <TableHead className='w-1/3'>Логин</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(u => (
                <TableRow
                  key={u.login}
                  onClick={() => {
                    setUser(u);
                    setIsOpenEditModal(true);
                  }}
                  className='cursor-pointer hover:bg-gray-100'
                >
                  <TableCell className='py-3'>{u.firstName}</TableCell>
                  <TableCell className='py-3'>{u.lastName}</TableCell>
                  <TableCell className='py-3'>{u.login}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <Table className='w-full'>
            <TableCaption className='text-lg font-bold mb-4'>
              Брони
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='w-1/4'>Пользователь</TableHead>
                <TableHead className='w-1/4'>Название коворкинга</TableHead>
                <TableHead className='w-1/4'>Время старта</TableHead>
                <TableHead className='w-1/4'>Конец брони</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map(b => (
                <TableRow
                  key={b.bookId}
                  onClick={() => {
                    setIsOpenDelete(true);
                    setSelectedBooking(b);
                  }}
                  className='cursor-pointer hover:bg-gray-100'
                >
                  <TableCell className='py-3'>{b.profile.login}</TableCell>
                  <TableCell className='py-3'>{b.coworking.title}</TableCell>
                  <TableCell className='py-3'>
                    {b.startTime.toLocaleString()}
                  </TableCell>
                  <TableCell className='py-3'>
                    {b.endTime.toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
        <DialogContent className='gap-6'>
          <DialogHeader>
            <DialogTitle>Вы действительно хотите отменить бронь?</DialogTitle>
          </DialogHeader>

          <Button
            onClick={async () => {
              try {
                if (!selectedBooking?.isRoom) {
                  await bookService.deleteBookPlace(
                    { bookId: selectedBooking?.bookId || '' },
                    auth
                  );
                } else {
                  await bookService.deleteBookRoom(
                    { bookId: selectedBooking.bookId },
                    auth
                  );
                }

                setBookings(prevBookings =>
                  prevBookings.filter(
                    booking => booking.bookId !== selectedBooking?.bookId
                  )
                );

                setIsOpenDelete(false);
              } catch (error) {
                console.error('Ошибка при удалении бронирования:', error);
              }
            }}
          >
            Да
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpenEditModal} onOpenChange={setIsOpenEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактирование пользователя</DialogTitle>
          </DialogHeader>

          <form
            className='flex flex-col gap-2'
            onSubmit={e => {
              e.preventDefault();
              onEditUser();
            }}
          >
            <div className='grid gap-1'>
              <Label htmlFor='firstName'>Имя</Label>
              <Input
                value={user?.firstName}
                id='firstName'
                name='firstName'
                onChange={e => setUser({ ...user!, firstName: e.target.value })}
              />
            </div>
            <div className='grid gap-1'>
              <Label htmlFor='lastName'>Фамилия</Label>
              <Input
                value={user?.lastName}
                id='lastName'
                name='lastName'
                onChange={e => setUser({ ...user!, lastName: e.target.value })}
              />
            </div>
            <div className='flex gap-1'>
              <Checkbox
                checked={user?.isPrivate}
                id='isPrivate'
                onCheckedChange={e => {
                  setUser({ ...user!, isPrivate: e as boolean });
                }}
              />
              <Label htmlFor='isPrivate'>Приватный профиль</Label>
            </div>
            <Button>Сохранить</Button>
          </form>
        </DialogContent>
      </Dialog>

      <VerifyBook
        isOpen={isOpenConfirmModal}
        setIsOpen={setIsOpenConfirmModal}
      />
    </>
  );
};
