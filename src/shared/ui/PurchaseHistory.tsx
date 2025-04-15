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
import { auth, bookService } from '../api';
import { CoworkingAccountBookResponse } from '../api/generated';

export const PurchaseHistory = () => {
  const [history, setHistory] = useState<CoworkingAccountBookResponse[]>([]);

  useEffect(() => {
    bookService
      .getAccountHistory(
        {
          page: 0,
          size: 100
        },
        auth
      )
      .then(setHistory);
  }, []);

  return (
    <Table className='mx-auto w-full mt-6'>
      <TableCaption>Список ваших транзакций.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[200px]'>Название коворкинга</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead>Адрес</TableHead>
          <TableHead className='text-right'>Сумма</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.map(h => (
          <TableRow>
            <TableCell>{h.coworking.title}</TableCell>
            <TableCell className='font-medium'>
              {h.startTime.toLocaleString()} – {h.endTime.toLocaleTimeString()}
            </TableCell>
            <TableCell>{h.coworking.location}</TableCell>
            <TableCell className='text-right'>{h.price}₽</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
