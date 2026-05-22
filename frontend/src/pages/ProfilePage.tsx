import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserProfile } from '../store/profileSlice';
import { logout } from '../store/authSlice';
import ProfileEditModal from '../components/profile/ProfileEditModal';
import type { AuthUser } from '../types/auth';
import type { ProfileUser } from '../types/profile';

const DEFAULT_AVATAR =
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces';

const SIDEBAR_ITEMS = [
    { id: 'overview', label: 'Overview', icon: 'dashboard', filled: true },
    { id: 'orders', label: 'Order History', icon: 'shopping_bag', href: '/orders' },
    { id: 'reviews', label: 'My Reviews', icon: 'reviews' },
    { id: 'wishlist', label: 'Wishlist', icon: 'favorite' },
    { id: 'settings', label: 'Account Settings', icon: 'settings' }
];

function displayName(user: ProfileUser | null, authUser: AuthUser | null) {
    return user?.fullName || user?.username || authUser?.username || 'Student';
}

function profileSubtitle(user: ProfileUser | null) {
    const major = user?.major?.name;
    const sid = user?.studentId;
    const parts = [];
    if (major) parts.push(major);
    if (sid) parts.push(`ID: ${sid}`);
    return parts.length ? parts.join(' • ') : user?.email || '';
}

function ProfileFooter() {
    return (
        <footer className="w-full bg-surface-container-low py-20">
            <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-4 px-6 md:grid-cols-4 lg:grid-cols-5 lg:px-8">
                <div className="col-span-2 lg:col-span-1">
                    <div className="mb-4 text-2xl font-bold text-on-surface">UTEShop</div>
                    <p className="text-xs text-on-surface-variant opacity-80">
                        Engineering-Grade Quality since 2018.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <h5 className="text-sm font-semibold text-primary">Shop</h5>
                    <a href="/#featured" className="text-xs text-on-surface-variant hover:text-primary">
                        Technology
                    </a>
                    <a href="/#featured" className="text-xs text-on-surface-variant hover:text-primary">
                        Textbooks
                    </a>
                    <a href="/#featured" className="text-xs text-on-surface-variant hover:text-primary">
                        Lab Gear
                    </a>
                </div>
                <div className="flex flex-col gap-4">
                    <h5 className="text-sm font-semibold text-primary">Support</h5>
                    <a href="#support" className="text-xs text-on-surface-variant hover:text-primary">
                        Student Support
                    </a>
                    <a href="#support" className="text-xs text-on-surface-variant hover:text-primary">
                        Shipping
                    </a>
                    <a href="#support" className="text-xs text-on-surface-variant hover:text-primary">
                        Contact
                    </a>
                </div>
                <div className="flex flex-col gap-4">
                    <h5 className="text-sm font-semibold text-primary">Legal</h5>
                    <a href="#support" className="text-xs text-on-surface-variant hover:text-primary">
                        Privacy Policy
                    </a>
                    <a href="#support" className="text-xs text-on-surface-variant hover:text-primary">
                        Terms of Service
                    </a>
                </div>
                <div className="col-span-2 mt-10 border-t border-outline-variant pt-10 md:col-span-4 lg:col-span-1 lg:mt-0 lg:border-none lg:pt-0">
                    <p className="text-xs text-on-surface-variant">
                        © 2024 UTEShop. Engineering-Grade Quality.
                    </p>
                </div>
            </div>
        </footer>
    );
}

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, isLoading, error } = useAppSelector((state) => state.profile);
    const authUser = useAppSelector((state) => state.auth.user);

    const [activeSection, setActiveSection] = useState('overview');
    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login', { replace: true });
    };

    const handleSectionNav = (item: (typeof SIDEBAR_ITEMS)[number]) => {
        if ('href' in item && item.href) {
            navigate(item.href);
            return;
        }
        setActiveSection(item.id);
        document.getElementById(`section-${item.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const name = displayName(user, authUser);
    const avatarSrc = user?.avatarUrl || DEFAULT_AVATAR;
    const isVerified = Boolean(user?.emailVerifiedAt) || user?.status === 'active';

    return (
        <div className="overflow-x-hidden bg-surface text-on-surface">
            <main className="mx-auto max-w-[1280px] px-6 pb-20 pt-10 lg:px-8">
                {isLoading ? (
                    <div className="flex justify-center py-32">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                    </div>
                ) : error && !user ? (
                    <div className="rounded-[24px] border border-error/20 bg-red-50 p-8 text-center text-error">
                        <p>{error}</p>
                        <button
                            type="button"
                            onClick={() => dispatch(fetchUserProfile())}
                            className="mt-4 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-on-primary"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Profile hero */}
                        <section className="mb-12">
                            <div className="soft-shadow flex flex-col items-start justify-between gap-6 rounded-[24px] bg-surface-container-lowest p-8 md:flex-row md:items-center">
                                <div className="flex items-center gap-6">
                                    <div className="relative shrink-0">
                                        <img
                                            src={avatarSrc}
                                            alt=""
                                            className="h-24 w-24 rounded-[24px] object-cover md:h-32 md:w-32"
                                        />
                                        {isVerified && (
                                            <div className="absolute -bottom-2 -right-2 rounded-full border-4 border-surface-container-lowest bg-primary p-1.5 text-white">
                                                <span className="material-symbols-outlined material-symbols-filled text-[16px]">
                                                    verified
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-semibold text-on-surface">{name}</h1>
                                        <p className="mt-1 text-base text-on-surface-variant">
                                            {profileSubtitle(user)}
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {user?.major?.name && (
                                                <span className="rounded-full bg-surface-container-high px-3 py-1 text-xs font-semibold text-on-surface-variant">
                                                    {user.major.name}
                                                </span>
                                            )}
                                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                                {user?.role === 'admin' ? 'Admin' : 'Prime Member'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex w-full flex-col gap-2 md:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => setEditOpen(true)}
                                        className="flex h-14 items-center justify-center gap-2 rounded-[24px] bg-primary px-8 text-sm font-medium text-on-primary transition active:scale-95 hover:shadow-lg"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        type="button"
                                        className="flex h-14 items-center justify-center gap-2 rounded-[24px] bg-surface-container-low px-8 text-sm font-medium text-on-surface transition active:scale-95 hover:bg-surface-container-high"
                                    >
                                        Student ID Card
                                    </button>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6">
                            {/* Sidebar */}
                            <aside className="hidden lg:col-span-3 lg:block">
                                <nav className="sticky top-28 flex flex-col gap-2">
                                    {SIDEBAR_ITEMS.map((item) => {
                                        const active = activeSection === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => handleSectionNav(item)}
                                                className={`flex items-center gap-3 rounded-xl p-4 text-left transition-all ${
                                                    active
                                                        ? 'bg-primary font-bold text-on-primary shadow-sm'
                                                        : 'text-on-surface-variant hover:bg-surface-container-high'
                                                }`}
                                            >
                                                <span
                                                    className={`material-symbols-outlined ${
                                                        item.filled && active ? 'material-symbols-filled' : ''
                                                    }`}
                                                >
                                                    {item.icon}
                                                </span>
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </button>
                                        );
                                    })}
                                    <hr className="my-4 border-outline-variant" />
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 rounded-xl p-4 text-left text-error transition-all hover:bg-error/10"
                                    >
                                        <span className="material-symbols-outlined">logout</span>
                                        <span className="text-sm font-medium">Sign Out</span>
                                    </button>
                                </nav>
                            </aside>

                            {/* Main content */}
                            <div className="flex flex-col gap-20 lg:col-span-9">
                                {/* Overview / mobile nav */}
                                <section id="section-overview">
                                    <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
                                        {SIDEBAR_ITEMS.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => handleSectionNav(item)}
                                                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${
                                                    activeSection === item.id
                                                        ? 'bg-primary text-on-primary'
                                                        : 'bg-surface-container-high text-on-surface-variant'
                                                }`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* Wishlist placeholder */}
                                <section id="section-wishlist">
                                    <h2 className="mb-4 text-2xl font-semibold text-on-surface">Wishlist</h2>
                                    <p className="rounded-[24px] bg-surface-container-low p-8 text-center text-on-surface-variant">
                                        Your saved items will appear here.
                                    </p>
                                </section>

                                {/* Reviews */}
                                <section id="section-reviews">
                                    <h2 className="mb-8 text-2xl font-semibold text-on-surface">My Reviews</h2>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="flex flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-primary/20 bg-primary/5 p-8 text-center">
                                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <span className="material-symbols-outlined text-[32px]">
                                                    rate_review
                                                </span>
                                            </div>
                                            <h3 className="mb-2 text-2xl font-semibold text-on-surface">
                                                Share your thoughts
                                            </h3>
                                            <p className="mb-6 text-sm text-on-surface-variant">
                                                You haven&apos;t reviewed your last purchase. Help your fellow
                                                engineers!
                                            </p>
                                            <button
                                                type="button"
                                                className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-on-primary transition active:scale-95"
                                            >
                                                Write Review
                                            </button>
                                        </div>
                                        <div className="soft-shadow rounded-[24px] bg-surface-container-lowest p-8">
                                            <div className="mb-4 flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((n) => (
                                                    <span
                                                        key={n}
                                                        className="material-symbols-outlined material-symbols-filled text-primary"
                                                    >
                                                        star
                                                    </span>
                                                ))}
                                            </div>
                                            <h3 className="mb-2 text-sm font-medium text-on-surface">
                                                Graphing Calculator TI-84 Plus
                                            </h3>
                                            <p className="mb-4 text-base italic text-on-surface-variant">
                                                &quot;Essential for my thermodynamics class. High build quality and
                                                the battery life is impressive for a student budget.&quot;
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm text-on-surface-variant">
                                                    thumb_up
                                                </span>
                                                <span className="text-xs text-on-surface-variant">
                                                    12 people found this helpful
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Settings */}
                                <section id="section-settings">
                                    <h2 className="mb-8 text-2xl font-semibold text-on-surface">
                                        Account Settings
                                    </h2>
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                                        {[
                                            {
                                                icon: 'lock',
                                                title: 'Security',
                                                desc: 'Passwords, 2FA, Devices'
                                            },
                                            {
                                                icon: 'credit_card',
                                                title: 'Payments',
                                                desc: 'Student loans, Cards, Billing'
                                            },
                                            {
                                                icon: 'notifications',
                                                title: 'Notifications',
                                                desc: 'Order alerts, Price drops'
                                            }
                                        ].map((card) => (
                                            <button
                                                key={card.title}
                                                type="button"
                                                className="group cursor-pointer rounded-2xl bg-surface-container-low p-6 text-left transition-colors hover:bg-surface-container-high"
                                            >
                                                <span className="material-symbols-outlined mb-3 text-primary transition-transform group-hover:scale-110">
                                                    {card.icon}
                                                </span>
                                                <h4 className="text-sm font-medium text-on-surface">
                                                    {card.title}
                                                </h4>
                                                <p className="mt-1 text-xs text-on-surface-variant">{card.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-error/20 py-4 text-error transition hover:bg-error/10 lg:hidden"
                                    >
                                        <span className="material-symbols-outlined">logout</span>
                                        Sign Out
                                    </button>
                                </section>
                            </div>
                        </div>
                    </>
                )}
            </main>

            <ProfileFooter />
            <ProfileEditModal open={editOpen} onClose={() => setEditOpen(false)} />
        </div>
    );
};

export default ProfilePage;

