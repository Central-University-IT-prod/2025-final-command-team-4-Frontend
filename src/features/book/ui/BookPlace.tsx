import { CoworkingFloorPlaceResponse } from '@/shared/api/generated';
import { DialogContent, Dialog, DialogHeader } from '@/shared/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { FC, useState } from 'react';
import { SocialUser } from './SocialUser';

interface BookPlaceProps {
  p: CoworkingFloorPlaceResponse;
  selectedPlaceId: string | null;
  setSelectedPlaceId(selectedPlaceId: string | null): void;
  width: number;
  height: number;
}

export const BookPlace: FC<BookPlaceProps> = ({
  p,
  selectedPlaceId,
  setSelectedPlaceId,
  width,
  height
}) => {
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  return (
    <>
      <div
        key={p.placeId}
        className={clsx('absolute w-7 h-7 rounded-lg border', {
          'bg-neutral-300 border-netural-400': p.bookings.length > 0,
          'bg-orange-300 border-orange-400': p.placeId == selectedPlaceId,
          'bg-blue-300 border-blue-400': p.bookings.length === 0
        })}
        style={{
          top: p.longitude * height,
          left: p.latitude * width
        }}
        onClick={() => {
          if (p.bookings?.length == 0) {
            setSelectedPlaceId(p.placeId);
          } else {
            setIsOpenPopover(true);
          }
        }}
      ></div>

      <Dialog open={isOpenPopover} onOpenChange={setIsOpenPopover}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Информация о брони:</DialogTitle>
          </DialogHeader>
          {p.bookings.length == 0 && 'Свободно'}
          {p.bookings.map(b => (
            <SocialUser key={b.login} b={b} />
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
};
