import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiHeart,
  FiBook,
  FiMonitor,
  FiCoffee,
  FiPackage,
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiChevronRight,
} from 'react-icons/fi';

function StarRating({ clipId }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 shrink-0"
      aria-hidden
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M7.68335 1.53C7.71257 1.47097 7.7577 1.42129 7.81365 1.38655C7.86961 1.35181 7.93416 1.3334 8.00002 1.3334C8.06588 1.3334 8.13043 1.35181 8.18639 1.38655C8.24234 1.42129 8.28747 1.47097 8.31669 1.53L9.85669 4.64933C9.95814 4.85465 10.1079 5.03227 10.2931 5.16697C10.4783 5.30167 10.6934 5.38941 10.92 5.42267L14.364 5.92667C14.4293 5.93612 14.4906 5.96365 14.541 6.00613C14.5914 6.04862 14.629 6.10437 14.6494 6.16707C14.6698 6.22978 14.6722 6.29694 14.6564 6.36096C14.6406 6.42498 14.6072 6.4833 14.56 6.52933L12.0694 8.95467C11.9051 9.11474 11.7822 9.31232 11.7112 9.53042C11.6403 9.74852 11.6234 9.98059 11.662 10.2067L12.25 13.6333C12.2615 13.6986 12.2545 13.7657 12.2297 13.8271C12.2049 13.8885 12.1633 13.9417 12.1097 13.9807C12.0561 14.0196 11.9927 14.0427 11.9266 14.0473C11.8605 14.0519 11.7945 14.0378 11.736 14.0067L8.65735 12.388C8.4545 12.2815 8.22881 12.2258 7.99969 12.2258C7.77057 12.2258 7.54487 12.2815 7.34202 12.388L4.26402 14.0067C4.20557 14.0376 4.13962 14.0515 4.07365 14.0468C4.00769 14.0421 3.94437 14.019 3.89088 13.9801C3.8374 13.9412 3.79591 13.8881 3.77112 13.8268C3.74634 13.7655 3.73926 13.6985 3.75069 13.6333L4.33802 10.2073C4.37682 9.98116 4.36001 9.74893 4.28905 9.5307C4.21808 9.31246 4.09509 9.11477 3.93069 8.95467L1.44002 6.53C1.39242 6.48402 1.35868 6.4256 1.34266 6.36138C1.32664 6.29717 1.32898 6.22975 1.34941 6.16679C1.36983 6.10384 1.40753 6.04789 1.4582 6.00532C1.50888 5.96275 1.57049 5.93527 1.63602 5.926L5.07935 5.42267C5.30619 5.38967 5.52161 5.30204 5.70708 5.16733C5.89254 5.03261 6.04249 4.85485 6.14402 4.64933L7.68335 1.53Z"
          fill="#FCC800"
          stroke="#FCC800"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

const categories = [
  { label: 'Đồ lưu niệm', iconBg: 'bg-[#EFF6FF]', Icon: FiHeart, iconClass: 'text-[#155DFC]' },
  { label: 'Học tập & Kỹ thuật', iconBg: 'bg-[#FAF5FF]', Icon: FiBook, iconClass: 'text-[#9810FA]' },
  { label: 'Công nghệ', iconBg: 'bg-[#F0FDF4]', Icon: FiMonitor, iconClass: 'text-[#00A63E]' },
  { label: 'Đời sống', iconBg: 'bg-[#FFF7ED]', Icon: FiCoffee, iconClass: 'text-[#F54900]' },
  { label: 'Đồ cũ & Thanh lý', iconBg: 'bg-[#FDF2F8]', Icon: FiPackage, iconClass: 'text-[#E60076]' },
];

const featuredProducts = [
  {
    id: '1',
    image: '/OHoodieUteLimited.png',
    alt: 'Áo Hoodie UTE Limited',
    tag: 'Đồ lưu niệm',
    rating: '4.9',
    clipId: 'star_home_1',
    title: 'Áo Hoodie UTE Limited',
    description: 'Thiết kế độc quyền, cotton 100%, in logo UTE phiên bản 2026',
    price: '350.000đ',
  },
  {
    id: '2',
    image: '/ArduinoKitStarterPro.png',
    alt: 'Arduino Kit Starter Pro',
    tag: 'Học tập',
    rating: '4.8',
    clipId: 'star_home_2',
    title: 'Arduino Kit Starter Pro',
    description: 'Bộ kit hoàn chỉnh: Arduino Uno R3, cảm biến, LED, điện trở',
    price: '450.000đ',
  },
  {
    id: '3',
    image: '/ChutGamingRgb.png',
    alt: 'Chuột Gaming RGB',
    tag: 'Công nghệ',
    rating: '4.7',
    clipId: 'star_home_3',
    title: 'Chuột Gaming RGB',
    description: 'DPI 3200, LED RGB 7 màu, thiết kế ergonomic',
    price: '250.000đ',
  },
  {
    id: '4',
    image: '/NHcChngCnLed.png',
    alt: 'Đèn học chống cận LED',
    tag: 'Đời sống',
    rating: '4.9',
    clipId: 'star_home_4',
    title: 'Đèn học chống cận LED',
    description: '3 chế độ ánh sáng, cổng USB sạc điện thoại, điều chỉnh độ cao',
    price: '180.000đ',
  },
  {
    id: '5',
    image: '/BnPhmCBluetooth.png',
    alt: 'Bàn phím cơ Bluetooth',
    tag: 'Công nghệ',
    rating: '4.8',
    clipId: 'star_home_5',
    title: 'Bàn phím cơ Bluetooth',
    description: 'Switch xanh, kết nối đa thiết bị, pin 2000mAh',
    price: '550.000đ',
  },
  {
    id: '6',
    image: '/STayUteEngineering.png',
    alt: 'Sổ tay UTE Engineering',
    tag: 'Đồ lưu niệm',
    rating: '4.7',
    clipId: 'star_home_6',
    title: 'Sổ tay UTE Engineering',
    description: 'Giấy A5 200 trang, bìa cứng, in hình cổng trường UTE',
    price: '45.000đ',
  },
];

function ShopHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-[rgba(255,255,255,0.92)] backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-6 lg:px-[145px]">
        <Link to="/" className="font-inter text-2xl font-semibold leading-8 text-[#155DFC]">
          UTEShop
        </Link>
        <nav className="hidden items-center md:flex" aria-label="Chính">
          <span className="pr-8 font-inter text-sm font-medium leading-5 text-[#101828]">Home</span>
          <a href="#featured" className="pr-8 font-inter text-sm font-medium leading-5 text-[#364153] hover:text-[#101828]">
            Products
          </a>
          <a href="#promo" className="pr-8 font-inter text-sm font-medium leading-5 text-[#364153] hover:text-[#101828]">
            Promotion
          </a>
          <a href="#about" className="pr-8 font-inter text-sm font-medium leading-5 text-[#364153] hover:text-[#101828]">
            About
          </a>
          <a href="#support" className="font-inter text-sm font-medium leading-5 text-[#364153] hover:text-[#101828]">
            Support
          </a>
        </nav>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-lg p-2 text-[#364153] hover:bg-gray-100"
            aria-label="Tìm kiếm"
          >
            <FiSearch className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <Link
            to="/login"
            className="rounded-lg p-2 text-[#364153] hover:bg-gray-100"
            aria-label="Tài khoản"
          >
            <FiUser className="h-5 w-5" strokeWidth={1.75} />
          </Link>
          <div className="relative pr-2">
            <button
              type="button"
              className="relative rounded-full p-2 text-[#364153] hover:bg-gray-100"
              aria-label="Giỏ hàng, 3 sản phẩm"
            >
              <FiShoppingCart className="h-5 w-5" strokeWidth={1.75} />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#155DFC] px-1 font-inter text-[10px] font-medium leading-[15px] text-white">
                3
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function CategoryStrip() {
  return (
    <section className="w-full bg-white px-6 py-12 lg:px-[145px] lg:py-20">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map(({ label, iconBg, Icon, iconClass }) => (
          <button
            key={label}
            type="button"
            className="flex flex-col items-center gap-4 rounded-3xl bg-[#F9FAFB] p-8 text-center transition hover:bg-[#F3F4F6]"
          >
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${iconBg}`}>
              <Icon className={`h-8 w-8 ${iconClass}`} strokeWidth={1.75} />
            </div>
            <p className="font-inter text-sm font-medium leading-5 text-[#101828]">{label}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-b from-[#F9FAFB] to-white px-6 py-16 lg:px-[145px] lg:py-32">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-8">
          <h1 className="font-inter text-4xl font-semibold leading-tight text-[#101828] sm:text-5xl lg:text-7xl lg:leading-[90px]">
            UTE. Lifestyle.
          </h1>
          <p className="max-w-[512px] font-inter text-lg leading-7 text-[#4A5565] sm:text-xl">
            Mọi thứ sinh viên UTE cần - từ đồ lưu niệm, thiết bị học tập đến phụ kiện công nghệ. Chất
            lượng, giá sinh viên.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#featured"
              className="inline-flex items-center justify-center rounded-full bg-[#155DFC] px-8 py-[18px] font-inter text-base font-medium leading-6 text-white transition hover:bg-[#1249d1]"
            >
              Shop Now
            </a>
            <a
              href="#featured"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#101828] px-8 py-4 font-inter text-base font-medium leading-6 text-[#101828] transition hover:bg-[#101828] hover:text-white"
            >
              Explore Products
            </a>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
          <img
            src="/PremiumLaptop.png"
            alt="Premium Laptop"
            className="h-[280px] w-full object-cover sm:h-[340px] lg:h-[395px]"
          />
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]">
      <div className="overflow-hidden bg-[#F3F4F6]">
        <img src={product.image} alt={product.alt} className="h-[280px] w-full object-cover sm:h-[320px] lg:h-[389px]" />
      </div>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[#EFF6FF] px-3 py-1 font-inter text-xs font-medium leading-4 text-[#155DFC]">
            {product.tag}
          </span>
          <div className="flex items-center gap-1">
            <StarRating clipId={product.clipId} />
            <span className="font-inter text-sm leading-5 text-[#4A5565]">{product.rating}</span>
          </div>
        </div>
        <div className="flex flex-col gap-[7px]">
          <h3 className="font-inter text-xl font-semibold leading-7 text-[#101828]">{product.title}</h3>
          <p className="font-inter text-sm leading-[22.75px] text-[#4A5565]">{product.description}</p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <p className="font-inter text-2xl font-semibold leading-8 text-[#101828]">{product.price}</p>
          <button
            type="button"
            className="rounded-full bg-[#155DFC] px-6 py-3 font-inter text-base font-medium leading-6 text-white transition hover:bg-[#1249d1]"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </article>
  );
}

function FeaturedSection() {
  return (
    <section id="featured" className="scroll-mt-20 bg-[#F9FAFB] px-6 py-16 lg:px-[121px] lg:py-20">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-16 px-0 sm:px-6">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="font-inter text-3xl font-semibold leading-tight text-[#101828] sm:text-5xl sm:leading-[48px]">
            Sản phẩm nổi bật
          </h2>
          <p className="font-inter text-lg leading-7 text-[#4A5565] sm:text-xl">
            Được lựa chọn kỹ lưỡng cho sinh viên UTE
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <section id="promo" className="relative w-full overflow-hidden bg-gradient-to-br from-[#155DFC] via-[#9810FA] to-[#E60076] px-6 py-20 lg:px-[273px] lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[rgba(0,0,0,0.10)]" aria-hidden />
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center gap-6 text-center">
        <h2 className="font-inter text-3xl font-semibold leading-tight text-white sm:text-5xl sm:leading-[75px] lg:text-6xl">
          Khuyến mãi sinh viên UTE
        </h2>
        <p className="max-w-[768px] font-inter text-lg leading-8 text-[rgba(255,255,255,0.90)] sm:text-2xl sm:leading-[39px]">
          Giảm giá đặc biệt cho sinh viên. Mua nhiều giảm thêm. Miễn phí vận chuyển nội bộ trường.
        </p>
        <a
          href="#promo"
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-inter text-base font-medium leading-6 text-[#155DFC] transition hover:bg-gray-100"
        >
          Xem chi tiết
          <FiChevronRight className="h-5 w-5" strokeWidth={1.67} />
        </a>
      </div>
    </section>
  );
}

function ShopFooter() {
  return (
    <footer id="support" className="w-full scroll-mt-20 border-t border-[#E5E7EB] bg-[#F9FAFB] px-6 lg:px-[121px]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-0 py-16 sm:px-6">
        <div id="about" className="scroll-mt-20 grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <p className="font-inter text-base font-semibold leading-6 text-[#101828]">Danh mục</p>
            <ul className="flex flex-col gap-3 font-inter text-sm leading-5 text-[#4A5565]">
              <li>Đồ lưu niệm</li>
              <li>Học tập & Kỹ thuật</li>
              <li>Công nghệ</li>
              <li>Đồ cũ</li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-inter text-base font-semibold leading-6 text-[#101828]">Hỗ trợ</p>
            <ul className="flex flex-col gap-3 font-inter text-sm leading-5 text-[#4A5565]">
              <li>Liên hệ</li>
              <li>Vận chuyển</li>
              <li>Đổi trả</li>
              <li>Bảo hành</li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-inter text-base font-semibold leading-6 text-[#101828]">Về UTEShop</p>
            <ul className="flex flex-col gap-3 font-inter text-sm leading-5 text-[#4A5565]">
              <li>Giới thiệu</li>
              <li>Tuyển dụng</li>
              <li>Ưu đãi sinh viên</li>
              <li>Tin tức</li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-inter text-base font-semibold leading-6 text-[#101828]">Kết nối</p>
            <ul className="flex flex-col gap-3 font-inter text-sm leading-5 text-[#4A5565]">
              <li>Facebook</li>
              <li>Instagram</li>
              <li>Zalo</li>
              <li>YouTube</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-6 border-t border-[#E5E7EB] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-inter text-sm leading-5 text-[#4A5565]">
            © 2026 UTEShop. Dành riêng cho sinh viên UTE.
          </p>
          <div className="flex flex-wrap gap-6 font-inter text-sm leading-5 text-[#4A5565]">
            <span>Chính sách bảo mật</span>
            <span>Điều khoản dịch vụ</span>
            <span>Cookie</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-inter text-[#101828]">
      <ShopHeader />
      <main>
        <CategoryStrip />
        <HeroSection />
        <FeaturedSection />
        <PromoBanner />
      </main>
      <ShopFooter />
    </div>
  );
}
