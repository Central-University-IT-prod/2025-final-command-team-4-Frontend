import { accountService, auth, bookService } from '@/shared/api';
import {
  AccountProfileResponse,
  CoworkingFloorPlaceResponse,
  CoworkingFloorRoomResponse
} from '@/shared/api/generated';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useEffect, useState } from 'react';

function splitString(input: string): [string, string] {
  if (input.length === 0) {
    return ['', ''];
  }

  const firstLetter = input.charAt(0);
  const restOfString = input.slice(1);

  return [firstLetter, restOfString];
}

export const VerifyBook = ({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [room, setRoom] = useState<CoworkingFloorRoomResponse | null>(null);
  const [place, setPlace] = useState<CoworkingFloorPlaceResponse | null>(null);
  const [user, setUser] = useState<AccountProfileResponse | null>(null);

  useEffect(() => {
    setUser(null);
    if (room) {
      accountService
        .getProfile(
          {
            login: room?.bookings[0]?.login || ''
          },
          auth
        )
        .then(setUser);
    } else if (place) {
      accountService
        .getProfile(
          {
            login: place?.bookings[0]?.login || ''
          },
          auth
        )
        .then(setUser);
    }
  }, [room, place]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={state => {
        setRoom(null);
        setPlace(null);
        setIsOpen(state);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Подтверждение бронирования</DialogTitle>
        </DialogHeader>

        {!room && !place && (
          <Scanner
            onScan={res => {
              const code = res?.[0]?.rawValue;

              if (!code) return;

              const [t, id] = splitString(code);

              if (t === 'r') {
                bookService
                  .verifyRoomBook({ roomBookId: id }, auth)
                  .then(setRoom);
              } else if (t === 'p') {
                bookService
                  .verifyPlaceBook({ placeBookId: id }, auth)
                  .then(setPlace);
              }
            }}
          />
        )}

        {!!room && (
          <div>
            <div>
              Пользователь: {user?.firstName} {user?.lastName}
            </div>
            <div>Логин: {user?.login}</div>
            <div>
              От {new Date(room?.bookings?.[0]?.from).toLocaleDateString()} до{' '}
              {new Date(room?.bookings?.[0]?.to).toLocaleDateString()}
            </div>
            <Button onClick={() => setIsOpen(false)}>Окккккк</Button>
          </div>
        )}
        {!!place && (
          <div className='w-full'>
            <div>
              Пользователь: {user?.firstName} {user?.lastName}
            </div>
            <div>Логин: {user?.login}</div>
            <div>
              От {new Date(place?.bookings?.[0]?.from).toLocaleString()} до{' '}
              {new Date(place?.bookings?.[0]?.to).toLocaleString()}
            </div>
            <Button
              className='mt-3'
              onClick={() => {
                setPlace(null);
                setRoom(null);
                setIsOpen(false);
              }}
            >
              ОК
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
