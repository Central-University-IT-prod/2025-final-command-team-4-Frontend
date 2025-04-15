import { QRCodeGenerator } from '@/entity/qrcode-generator';
import { CoworkingAccountBookResponse } from '@/shared/api/generated';
import { Dialog, DialogContent } from '@/shared/ui/dialog';

interface ModalQrProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  data: CoworkingAccountBookResponse;
}

export const ModalQr = ({ isOpen, setIsOpen, data }: ModalQrProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <div className='flex justify-center'>
          <QRCodeGenerator id={(data.isRoom ? 'r' : 'p') + data.bookId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
