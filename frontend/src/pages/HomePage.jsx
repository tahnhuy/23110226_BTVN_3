import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBook,
  FiMonitor,
  FiPackage,
  FiSearch,
  FiShoppingCart,
  FiArrowRight,
  FiAward,
  FiHome,
  FiRefreshCw,
} from 'react-icons/fi';

const PRIMARY = '#004AC6';
const TEXT = '#191B23';
const TEXT_BODY = '#434655';
const TEXT_MUTED = '#6B7280';
const SURFACE = '#F3F3FE';
const PAGE_BG = '#FAF8FF';

const categories = [
  { label: 'University Merchandise', Icon: FiAward },
  { label: 'Study Tools', Icon: FiBook },
  { label: 'Technology', Icon: FiMonitor },
  { label: 'Student Life', Icon: FiHome },
  { label: 'Second-hand', Icon: FiRefreshCw },
];

const featuredProducts = [
  {
    id: '1',
    image: '/OHoodieUteLimited.png',
    alt: 'UTE Engineering Hoodie',
    tag: 'Merchandise',
    title: 'UTE Engineering Hoodie',
    price: '$45.00',
  },
  {
    id: '2',
    image: '/ArduinoKitStarterPro.png',
    alt: 'Engineering Starter Kit',
    tag: 'Study Tools',
    title: 'Engineering Starter Kit',
    price: '$89.00',
  },
  {
    id: '3',
    image: '/NHcChngCnLed.png',
    alt: 'Minimalist Study Lamp',
    tag: 'Student Life',
    title: 'Minimalist Study Lamp',
    price: '$32.00',
  },
];

const majors = [
  'General',
  'IT & Computer Science',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Architecture',
  'Biotechnology',
  'Civil Engineering',
];

function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/3 lg:block"
        style={{
          background: `linear-gradient(270deg, rgba(0, 74, 198, 0.05) 0%, rgba(0, 74, 198, 0) 100%)`,
        }}
        aria-hidden
      />
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-24 xl:py-32">
        <div className="flex flex-col">
          <h1
            className="font-inter text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-[56px] lg:leading-[1.1]"
            style={{ color: TEXT }}
          >
            Engineered for Excellence. Designed for Students.
          </h1>
          <p className="mt-6 max-w-[549px] font-inter text-lg leading-[29px]" style={{ color: TEXT_BODY }}>
            The complete ecosystem for UTE students. From high-end engineering tools to campus essentials,
            get everything you need for your university journey.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#featured"
              className="inline-flex h-14 items-center justify-center rounded-full px-8 font-inter text-base font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition hover:opacity-90"
              style={{ backgroundColor: PRIMARY }}
            >
              Shop Now
            </a>
            <Link
              to="/categories"
              className="inline-flex h-14 items-center justify-center rounded-full px-8 font-inter text-base font-medium shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition hover:bg-gray-200"
              style={{ backgroundColor: '#F5F5F7', color: TEXT }}
            >
              Explore Categories
            </Link>
          </div>
        </div>
        <div className="relative">
          <div
            className="absolute -left-2 -top-4 h-full w-full rounded-3xl opacity-50 blur-3xl"
            style={{ backgroundColor: 'rgba(0, 74, 198, 0.05)' }}
            aria-hidden
          />
          <img
            src="/PremiumLaptop.png"
            alt="Study space"
            className="relative w-full rounded-3xl object-cover shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
            style={{ aspectRatio: '592/600', maxHeight: 600 }}
          />
        </div>
      </div>
    </section>
  );
}

function CategorySection() {
  return (
    <section id="categories" className="scroll-mt-24 w-full px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="font-inter text-2xl font-semibold" style={{ color: TEXT }}>
          Shop by Category
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map(({ label, Icon }) => (
            <button
              key={label}
              type="button"
              className="flex flex-col items-center gap-4 rounded-3xl border border-white/30 bg-white/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-[20px] transition hover:bg-white/90"
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: '#EDE9FA' }}
              >
                <Icon className="h-9 w-9" style={{ color: PRIMARY }} strokeWidth={1.5} />
              </div>
              <span className="text-center font-inter text-sm leading-5" style={{ color: TEXT_BODY }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="h-80 overflow-hidden" style={{ backgroundColor: '#EDE9FA' }}>
        <img src={product.image} alt={product.alt} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col gap-3 p-6">
        <span className="font-inter text-xs font-medium uppercase tracking-wide" style={{ color: PRIMARY }}>
          {product.tag}
        </span>
        <h3 className="font-inter text-xl font-semibold leading-8" style={{ color: TEXT }}>
          {product.title}
        </h3>
        <div className="flex items-center justify-between pt-2">
          <p className="font-inter text-2xl font-semibold" style={{ color: TEXT }}>
            {product.price}
          </p>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full text-white transition hover:opacity-90"
            style={{ backgroundColor: PRIMARY }}
            aria-label={`Add ${product.title} to cart`}
          >
            <FiShoppingCart className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </article>
  );
}

function FeaturedSection() {
  return (
    <section id="featured" className="scroll-mt-24 w-full px-6 py-20 lg:px-8" style={{ backgroundColor: SURFACE }}>
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-inter text-3xl font-semibold" style={{ color: TEXT }}>
            Featured Essentials
          </h2>
          <a
            href="#featured"
            className="font-inter text-sm font-medium transition hover:underline"
            style={{ color: PRIMARY }}
          >
            View All Products
          </a>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBanners() {
  return (
    <section id="promo" className="scroll-mt-24 w-full px-6 py-20 lg:px-8">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 lg:grid-cols-2">
        <div
          className="relative overflow-hidden rounded-3xl p-12"
          style={{
            background: `linear-gradient(135deg, ${PRIMARY} 0%, #2563EB 100%)`,
            minHeight: 320,
          }}
        >
          <span className="inline-flex rounded-full bg-white/20 px-4 py-1 font-inter text-sm text-white backdrop-blur-md">
            Seasonal Sale
          </span>
          <h2 className="mt-6 max-w-md font-inter text-3xl font-semibold leading-tight text-white">
            Back to School: 20% Off All Merchandise.
          </h2>
          <a
            href="#featured"
            className="mt-6 inline-flex items-center gap-2 font-inter text-sm font-medium text-white transition hover:opacity-90"
          >
            Shop Collection
            <FiArrowRight className="h-5 w-5" />
          </a>
        </div>
        <div
          className="relative overflow-hidden rounded-3xl p-12"
          style={{ backgroundColor: '#F5F5F7', minHeight: 320 }}
        >
          <span
            className="inline-flex rounded-full px-4 py-1 font-inter text-sm font-medium"
            style={{ backgroundColor: 'rgba(0, 74, 198, 0.1)', color: PRIMARY }}
          >
            New Arrivals
          </span>
          <h2 className="mt-6 max-w-md font-inter text-3xl font-semibold leading-tight" style={{ color: TEXT }}>
            Starter Kits for Freshmen: Everything you need for Circuit Design 101.
          </h2>
          <a
            href="#featured"
            className="mt-6 inline-flex items-center gap-2 font-inter text-sm font-medium transition hover:opacity-80"
            style={{ color: PRIMARY }}
          >
            Build Your Kit
            <FiArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function MajorFilterSection() {
  const [activeMajor, setActiveMajor] = useState('General');

  return (
    <section className="w-full bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-[1280px] text-center">
        <h2 className="font-inter text-3xl font-semibold" style={{ color: TEXT }}>
          Curated for Your Degree
        </h2>
        <p className="mx-auto mt-4 max-w-[648px] font-inter text-lg leading-[29px]" style={{ color: TEXT_BODY }}>
          Select your major to see tailored equipment and material lists recommended by your faculty.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {majors.map((major) => {
            const isActive = activeMajor === major;
            return (
              <button
                key={major}
                type="button"
                onClick={() => setActiveMajor(major)}
                className="rounded-full px-6 py-3 font-inter text-sm font-medium transition"
                style={
                  isActive
                    ? {
                        backgroundColor: PRIMARY,
                        color: '#fff',
                        border: `2px solid ${PRIMARY}`,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                      }
                    : {
                        backgroundColor: 'transparent',
                        color: TEXT,
                        border: '2px solid #E1E2ED',
                      }
                }
              >
                {major}
              </button>
            );
          })}
        </div>
        <div className="relative mx-auto mt-10 max-w-[672px]">
          <FiSearch
            className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2"
            style={{ color: TEXT_BODY }}
            strokeWidth={1.75}
          />
          <input
            type="search"
            placeholder="Search for specific tools, books, or gear..."
            className="h-16 w-full rounded-full pl-14 pr-6 font-inter text-base shadow-[0_10px_30px_rgba(0,0,0,0.04)] outline-none transition focus:ring-2"
            style={{
              backgroundColor: SURFACE,
              color: TEXT,
              borderColor: 'transparent',
            }}
          />
        </div>
      </div>
    </section>
  );
}

function ShopFooter() {
  return (
    <footer id="support" className="scroll-mt-24 w-full px-6 lg:px-8" style={{ backgroundColor: SURFACE }}>
      <div className="mx-auto max-w-[1280px] py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-inter text-2xl font-semibold" style={{ color: TEXT }}>
              UTEShop
            </p>
            <p className="mt-4 max-w-xs font-inter text-sm leading-[22px]" style={{ color: TEXT_BODY }}>
              Elevating the student experience through precision-engineered tools and university-grade
              essentials.
            </p>
            <div className="mt-6 flex gap-4">
              {['Facebook', 'Instagram', 'Email'].map((label) => (
                <span
                  key={label}
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-xs"
                  style={{ color: TEXT_BODY }}
                  title={label}
                >
                  <FiPackage className="h-5 w-5" strokeWidth={1.5} />
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="font-inter text-sm font-semibold" style={{ color: TEXT }}>
              Support
            </p>
            <ul className="mt-4 flex flex-col gap-4 font-inter text-sm" style={{ color: TEXT_BODY }}>
              <li>
                <a href="#support" className="hover:underline">
                  Student Support
                </a>
              </li>
              <li>
                <a href="#support" className="hover:underline">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#support" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-inter text-sm font-semibold" style={{ color: TEXT }}>
              Legal
            </p>
            <ul className="mt-4 flex flex-col gap-4 font-inter text-sm" style={{ color: TEXT_BODY }}>
              <li>
                <a href="#support" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#support" className="hover:underline">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-inter text-sm font-semibold" style={{ color: TEXT }}>
              Community
            </p>
            <ul className="mt-4 flex flex-col gap-4 font-inter text-sm" style={{ color: TEXT_BODY }}>
              <li>
                <a href="#featured" className="hover:underline">
                  Second-hand Market
                </a>
              </li>
              <li>
                <a href="#support" className="hover:underline">
                  Faculty Guidelines
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="mt-12 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: '#C3C6D7' }}
        >
          <p className="font-inter text-sm" style={{ color: TEXT_BODY }}>
            © 2024 UTEShop. Engineering-Grade Quality.
          </p>
          <div className="flex gap-6">
            {[FiPackage, FiSearch, FiBook].map((Icon, i) => (
              <Icon key={i} className="h-5 w-5 cursor-pointer" style={{ color: TEXT_BODY }} strokeWidth={1.5} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div style={{ backgroundColor: PAGE_BG, color: TEXT }}>
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedSection />
        <PromoBanners />
        <MajorFilterSection />
      </main>
      <ShopFooter />
    </div>
  );
}
