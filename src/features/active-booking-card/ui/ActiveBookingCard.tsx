import { ModalQr } from '@/features/modal-qr';
import { auth, bookService } from '@/shared/api';
import { CoworkingAccountBookResponse } from '@/shared/api/generated';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { Street } from '@/shared/ui/Street';
import { useEffect, useState } from 'react';
import { FiTrash } from 'react-icons/fi';
import { LuScanQrCode } from 'react-icons/lu';
import { MdOutlineWatchLater } from 'react-icons/md';
import { Input } from '@/shared/ui/input';
import { formatTime } from '@/pages/BookCoworkPage';

interface ActiveBookingCardProps {
  booking: CoworkingAccountBookResponse;
  onDelete?: () => void;
}

export const ActiveBookingCard = ({
  booking,
  onDelete
}: ActiveBookingCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRenewModal, setIsOpenRenewModal] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const [form, setForm] = useState(() => {
    const startAt = new Date();
    startAt.setDate(startAt.getDate() + 1);
    startAt.setHours(7, 0, 0, 0);

    const endAt = new Date();
    endAt.setDate(endAt.getDate() + 1);
    endAt.setHours(19, 0, 0, 0);
    return {
      startAt,
      endAt
    };
  });

  useEffect(() => {
    const formCopy = structuredClone(form);
    formCopy.endAt.setFullYear(formCopy.startAt.getFullYear());
    formCopy.endAt.setMonth(formCopy.startAt.getMonth());
    formCopy.endAt.setDate(formCopy.startAt.getDate());
    formCopy.endAt.setHours(formCopy.endAt.getHours());
    formCopy.endAt.setMinutes(formCopy.endAt.getMinutes());
    formCopy.endAt.setSeconds(formCopy.endAt.getSeconds());
    setForm(o => ({ ...o, endAt: formCopy.endAt }));
  }, [form.startAt]);

  return (
    <article className='flex flex-col items-center border-1 gap-2 border-black px-4 py-2 rounded-md transition duration-200 ease-in-out hover:bg-gray-50'>
      <h3 className='text-lg font-medium'>
        {booking.coworking.title}
        <span className='text-green-400 ml-1'>•</span>
      </h3>
      <Street location={booking.coworking.location} />
      <div className='flex flex-col justify-between w-full gap-4'>
        <p className='text-sm bg-gray-100 rounded-md px-2 py-1'>
          {booking.startTime.toLocaleString()} –{' '}
          {booking.endTime.toLocaleTimeString()}{' '}
        </p>
        <p className='text-center text-lg font-medium'>{booking.price}₽</p>
      </div>
      <div className='flex gap-1 items-center'>
        <button
          onClick={() => setIsOpen(true)}
          className='text-2xl transition duration-150 ease-in-out hover:scale-105'
        >
          <LuScanQrCode />
        </button>
        <button
          onClick={() => setIsOpenDelete(true)}
          className='text-2xl transition duration-150 ease-in-out hover:scale-105'
        >
          <FiTrash />
        </button>
        <button
          onClick={() => setIsOpenRenewModal(true)}
          className='text-2xl text-center transition duration-150 ease-in-out hover:scale-105'
        >
          <MdOutlineWatchLater />
        </button>
      </div>
      <ModalQr data={booking} isOpen={isOpen} setIsOpen={setIsOpen} />
      <Dialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
        <DialogContent className='gap-6'>
          <DialogHeader>
            <DialogTitle>Вы действительно хотите отменить бронь?</DialogTitle>
          </DialogHeader>

          <Button
            onClick={async () => {
              if (!booking.isRoom) {
                await bookService.deleteBookPlace(
                  { bookId: booking.bookId },
                  auth
                );
              } else {
                await bookService.deleteBookRoom(
                  { bookId: booking.bookId },
                  auth
                );
              }

              onDelete?.();
              setIsOpenDelete(false);
            }}
          >
            Да
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={isOpenRenewModal} onOpenChange={setIsOpenRenewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Перенести бронь</DialogTitle>
          </DialogHeader>

          <div className='flex flex-col gap-1'>
            С
            <Input
              type='datetime-local'
              required
              defaultValue={(() => {
                try {
                  return form.startAt.toISOString().substring(0, 16);
                } catch (e) {
                  return new Date().toISOString().substring(0, 16);
                }
              })()}
              onChange={e => {
                try {
                  const date = new Date(e.target.value);
                  setForm(o => ({ ...o, startAt: date }));
                } catch (e) {}
              }}
            />
            до
            <Input
              type='time'
              required
              defaultValue={(() => {
                try {
                  return formatTime(form.endAt);
                } catch (e) {
                  return formatTime(new Date());
                }
              })()}
              onChange={e => {
                try {
                  const [hours, minutes] = e.target.value
                    .split(':')
                    .map(Number);

                  setForm(o => {
                    const date = new Date(o.startAt);
                    date.setHours(hours);
                    date.setMinutes(minutes);
                    return { ...o, endAt: date };
                  });
                  // setForm(o => ({ ...o, endAt: date }));
                } catch (e) {}
              }}
            />
            <Button
              onClick={async () => {
                setIsOpenRenewModal(false);
                const res = await bookService.putBookPlace({
                  bookId: booking.bookId,
                  ...form
                });

                if (!res) return;
              }}
            >
              Перенести
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
};
