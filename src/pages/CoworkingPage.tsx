import { auth, coworkingApi } from '@/shared/api';
import { CoworkingResponse } from '@/shared/api/generated';
import { Button } from '@/shared/ui/button';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ImageSwiper } from '@/shared/ui/ImageSwiper';
import { IoIosNavigate } from 'react-icons/io';

export const CoworkingPage = () => {
  const { id } = useParams();
  const [cowork, setCowork] = useState<CoworkingResponse | null>(null);

  useEffect(() => {
    if (id) {
      coworkingApi
        .findCoworkingSpace(
          {
            coworkingId: id,
            startAt: new Date(),
            endAt: (() => {
              const endAt = new Date();
              endAt.setDate(endAt.getDate() + 1);
              return endAt;
            })()
          },
          auth
        )
        .then(setCowork);
    }
  }, [id]);

  return (
    <main>
      <section className='flex flex-col items-center gap-2'>
        <div className='flex flex-col items-center gap-4'>
          <div className='flex justify-center gap-3 px-4'>
            <h1 className='text-3xl font-medium sm:text-4xl'>
              {cowork?.title}
            </h1>
            <p className='flex items-center gap-1 px-2 rounded-md'>
              <IoIosNavigate fontSize={20} />
              <span className='text-sm font-medium'>{cowork?.location}</span>
            </p>
          </div>
          <Link to={`/coworking/${id}/book`}>
            <Button className='text-xl'>Забронировать</Button>
          </Link>
        </div>
        <p className='text-lg'>{cowork?.time}</p>
      </section>
      <section className='mt-4 px-2'>
        <ImageSwiper />
      </section>
      <section className='flex flex-col px-2 mt-8 gap-3'>
        <div className='flex justify-center items-center w-full'>
          <div className='flex-grow border-t border-black max-w-1/4'></div>
          <span className='px-4 text-lg font-medium'>Подробнее</span>
          <div className='flex-grow border-t border-black max-w-1/4'></div>
        </div>
        <p className='text-lg text-center'>{cowork?.description}</p>
      </section>
    </main>
  );
};
