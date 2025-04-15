import { ActiveBookingCard } from '@/features/active-booking-card';
import { CoworkingAccountBookResponse } from '@/shared/api/generated';
import { auth, bookService } from '@/shared/api/index';
import { MainAbout } from '@/widgets/main-about';
import { useEffect, useState } from 'react';

export function HomePage() {
  const [bookings, setBookings] = useState<CoworkingAccountBookResponse[]>([]);

  useEffect(() => {
    bookService
      .getActiveAccountBookings(
        {
          page: 0,
          size: 100
        },
        auth
      )
      .then(setBookings);
  }, []);

  return (
    <main>
      <section className='flex flex-col text-center justify-center items-center gap-6 mt-8 px-3'>
        <h1 className='text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl'>
          Подберем лучший коворкинг для вас
        </h1>
        <p className='text-base max-md:text-center'>
          Получайте комфортные условия, бронируйте без комиссии и наслаждайтесь
          удобством работы
        </p>
      </section>
      {!!bookings.length && (
        <section className='flex flex-col items-center mt-6 gap-3'>
          <h2 className='text-xl font-medium'>Активные бронирования</h2>
          <div className='max-w-full overflow-hidden'>
            <div className='flex gap-5 overflow-x-auto whitespace-nowrap px-2 py-2 custom-scroll'>
              {bookings.map((booking: CoworkingAccountBookResponse) => (
                <ActiveBookingCard
                  booking={booking}
                  onDelete={() => {
                    bookService
                      .getActiveAccountBookings(
                        {
                          page: 0,
                          size: 100
                        },
                        auth
                      )
                      .then(setBookings);
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      <MainAbout />
    </main>
  );
}
