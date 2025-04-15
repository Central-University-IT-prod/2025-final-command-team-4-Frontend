import { BookPlace } from '@/features/book';
import { auth, bookService, coworkingApi } from '@/shared/api';
import { CoworkingResponse } from '@/shared/api/generated';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export const BookCoworkPage = () => {
  const { id } = useParams();
  const [coworking, setCoworking] = useState<CoworkingResponse | null>();
  const [index, setIndex] = useState(0);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  const floor = useMemo(() => {
    if (!coworking) return null;
    return coworking.floors[index] || null;
  }, [coworking, index]);

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
  const ref = useRef<HTMLImageElement>(null);

  const [{ width, height }, setSize] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const formCopy = structuredClone(form);
    formCopy.endAt.setFullYear(formCopy.startAt.getFullYear());
    formCopy.endAt.setHours(formCopy.endAt.getHours());
    formCopy.endAt.setMinutes(formCopy.endAt.getMinutes());
    formCopy.endAt.setSeconds(formCopy.endAt.getSeconds());
    formCopy.endAt.setMonth(formCopy.startAt.getMonth());
    formCopy.endAt.setDate(formCopy.startAt.getDate());

    setForm(o => ({ ...o, endAt: formCopy.endAt }));
  }, [form.startAt]);

  useEffect(() => {
    coworkingApi
      .findCoworkingSpace(
        { coworkingId: id!, endAt: form.endAt, startAt: form.startAt },
        auth
      )
      .then(setCoworking);
  }, [form]);

  const onSubmit = async () => {
    if (!id || !selectedPlaceId) {
      return;
    }

    const res = await bookService
      .createBookPlace(
        {
          coworkingId: id!,
          endAt: (() => {
            const end = new Date(form.endAt);
            end.setHours(end.getHours() + 3);
            return end;
          })(),
          startAt: (() => {
            const start = new Date(form.startAt);
            // start.setHours(start.getHours());
            return start;
          })(),
          placeId: selectedPlaceId!
        },
        auth
      )
      .catch(e => {
        toast('Не удалось забронировать место', { description: e.message });
      });

    if (!res) return;

    navigate(`/`);
  };

  useEffect(() => {
    coworkingApi
      .downloadFloorImage({ floorId: floor?.floorId || '' }, auth)
      .then(e => URL.createObjectURL(e))
      .then(setImage)
      .then(() => {
        setTimeout(() => {
          setSize({
            width: ref.current?.width || 0,
            height: ref.current?.height || 0
          });
        }, 100);
      });
  }, [floor]);

  return (
    <main className='max-w-lg mx-auto max-md:px-2'>
      <div>
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
              const [hours, minutes] = e.target.value.split(':').map(Number);

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
      </div>

      <div>
        <div>Этаж</div>

        <div className='flex gap-1 overflow-x-auto'>
          {coworking?.floors.map((floor, i) => (
            <button
              key={i}
              className={clsx(
                'w-10 h-10 rounded-lg  text-white flex justify-center items-center',
                {
                  'bg-neutral-500': i == index,
                  'bg-neutral-300': i != index
                }
              )}
              onClick={() => {
                setSelectedPlaceId(null);
                setIndex(i);
              }}
            >
              {floor.floorOrder}
            </button>
          ))}
        </div>
      </div>

      <div className='relative select-none my-4'>
        <img src={image} alt='Коворкинг места' ref={ref} />
        {floor?.places.map(p => (
          <BookPlace
            p={p}
            key={p.placeId}
            selectedPlaceId={selectedPlaceId}
            setSelectedPlaceId={setSelectedPlaceId}
            width={width}
            height={height}
          />
        ))}
      </div>

      {!!selectedPlaceId ? (
        <>
          <div>
            Итого к оплате:{' '}
            {floor?.places?.find(p => p.placeId == selectedPlaceId)?.price} ₽
          </div>
          <Button className='w-full' onClick={onSubmit}>
            Забронировать
          </Button>
        </>
      ) : (
        <div>Сначала выберите место</div>
      )}
    </main>
  );
};
