import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import image1 from '@/shared/ui/image1.jpg';
import image2 from '@/shared/ui/image2.jpg';
import image3 from '@/shared/ui/image3.jpg';
import image4 from '@/shared/ui/image4.jpg';

export const ImageSwiper = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={10}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop
      className="w-full h-[300px]"
      breakpoints={{
        320: {
          slidesPerView: 1
        },
        640: {
          slidesPerView: 2
        },
        1024: {
          slidesPerView: 3
        }
      }
      }
    >
      <SwiperSlide>
        <img src={image1} alt='Coworking image' className="w-full h-full object-cover rounded-md" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={image2} alt='Coworking image' className="w-full h-full object-cover rounded-md" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={image3} alt='Coworking image' className="w-full h-full object-cover rounded-md" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={image4} alt='Coworking image' className="w-full h-full object-cover rounded-md" />
      </SwiperSlide>
    </Swiper>
  );
};