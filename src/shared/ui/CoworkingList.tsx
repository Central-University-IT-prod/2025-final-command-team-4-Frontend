import * as React from 'react';
import { useNavigate } from 'react-router';

import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { CoworkingElementResponse } from '../api/generated';

export const CoworkingList = ({
  coworks
}: {
  coworks: CoworkingElementResponse[];
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const navigate = useNavigate();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='px-4 py-2 justify-between text-base'
        >
          Пространства
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Поиск...' />
          <CommandList>
            <CommandEmpty>Коворкинги не найдены.</CommandEmpty>
            <CommandGroup>
              {coworks.map(c => (
                <CommandItem
                  key={c.coworkingId}
                  value={c.title}
                  onSelect={currentValue => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                    navigate(`/coworking/${c.coworkingId}`);
                  }}
                >
                  {c.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
