import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

export interface GalleryImage {
    id?: number;
    url: string;
    altText?: string;
}

interface ProductImageGalleryProps {
    images: GalleryImage[];
    productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

    if (images.length === 0) {
        return (
            <div className="soft-shadow flex aspect-square items-center justify-center overflow-hidden rounded-[24px] bg-surface-container-low">
                <img
                    src="/PremiumLaptop.png"
                    alt={productName}
                    className="h-full w-full object-cover"
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Swiper
                modules={[Navigation, Pagination, Thumbs]}
                navigation
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                spaceBetween={10}
                className="product-gallery-main soft-shadow overflow-hidden rounded-[24px] bg-surface-container-low"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={img.id ?? index}>
                        <div className="flex aspect-square items-center justify-center">
                            <img
                                src={img.url}
                                alt={img.altText || productName}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {images.length > 1 && (
                <Swiper
                    modules={[FreeMode, Thumbs, Navigation]}
                    onSwiper={setThumbsSwiper}
                    spaceBetween={12}
                    slidesPerView={4}
                    freeMode
                    watchSlidesProgress
                    className="product-gallery-thumbs"
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={`thumb-${img.id ?? index}`} className="cursor-pointer">
                            <div className="aspect-square overflow-hidden rounded-xl bg-surface-container ring-2 ring-transparent transition [.swiper-slide-thumb-active_&]:ring-primary">
                                <img
                                    src={img.url}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}
