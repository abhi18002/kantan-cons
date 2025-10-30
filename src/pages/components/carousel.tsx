'use client';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import styles from './carousel.module.css';
import { SLIDES } from '../constants';

const SketchCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Swiper
      effect='coverflow'
      grabCursor
      centeredSlides
      slidesPerView='auto'
      loop
      speed={1000}
      spaceBetween={40} // 👈 add space between slides
      autoplay={{
        delay: 2200,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        waitForTransition: true,
      }}
      coverflowEffect={{
        rotate: 20,
        stretch: 0,
        depth: 120,
        modifier: 1,
        slideShadows: false,
      }}
      modules={[EffectCoverflow, Autoplay]}
      onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
    >
      {SLIDES.map((slide, index) => (
        <SwiperSlide
          key={index}
          style={{
            width: '340px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className={`${styles['carousel-item']} ${
              index === activeIndex ? styles.active : ''
            }`}
          >
            <img
              src={'/carousel/' + slide.src}
              alt={slide.title}
              className={styles['carousel-img']}
              loading='lazy'
            />
            <p className={styles['carousel-text']}>{slide.title}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SketchCarousel;
