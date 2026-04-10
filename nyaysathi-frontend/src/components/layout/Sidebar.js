import Link from 'next/link';
import { useRouter } from 'next/router';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { Contacts, Edit, EditCalendar, FormatListBulleted, Language, QrCodeScanner, Settings } from '@mui/icons-material';

const navItems = [
    { label: 'Dashboard', icon: HomeFilledIcon, href: '/' },
    { label: 'Calendar', icon: EditCalendar, href: '/calendar/calendar' },
    { label: 'Tasks', icon: FormatListBulleted, href: '/task/task' },
    { label: 'Contacts', icon: Contacts, href: '/contact/contact' },
    { label: 'AI Summarizer', icon: QrCodeScanner, href: '/ai-summarizer/ai-summarizer' },
    { label: 'Legal Notes / Drafts', icon: Edit, href: '/legal-notes/legal-notes' },
    { label: 'Language Translation', icon: Language, href: '/language-translation' },
    { label: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar({ open = true, onOpenChange }) {
    const router = useRouter();
    const setOpen = onOpenChange ?? (() => { });

    return (
        <aside
            className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[var(--border-subtle)] bg-[var(--sidebar)] transition-[width] duration-300 ease-out ${open ? 'w-64 px-4' : 'w-20 px-2'
                }`}
        >
            <div className="flex flex-1 flex-col pt-6">
                <div className="mb-8 flex items-center gap-2">
                    <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2A59D1] text-sm font-bold text-white shadow-sm ${!open ? 'mx-auto' : ''
                            }`}
                    >
                        N
                    </div>
                    <div className={`min-w-0 flex-1 transition-opacity duration-200 ${!open ? 'pointer-events-none opacity-0 w-0 overflow-hidden' : ''}`}>
                        <div className="truncate text-base font-semibold tracking-tight text-slate-800">Nyaysathi</div>
                        <div className="truncate text-xs text-slate-500">Legal practice suite</div>
                    </div>
                    <button
                        type="button"
                        className={`ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/80 hover:text-slate-800 ${!open ? 'hidden' : ''}`}
                        onClick={() => setOpen(false)}
                        aria-label="Collapse sidebar"
                    >
                        <ChevronLeft fontSize="small" />
                    </button>
                </div>
                {!open && (
                    <button
                        type="button"
                        className="mb-4 flex h-8 w-8 items-center justify-center self-center rounded-lg text-slate-500 transition hover:bg-white/80"
                        onClick={() => setOpen(true)}
                        aria-label="Expand sidebar"
                    >
                        <ChevronRight fontSize="small" />
                    </button>
                )}
                <nav className="flex flex-col gap-1 overflow-y-auto pb-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            router.pathname === item.href ||
                            (item.href !== '/' && router.pathname.startsWith(item.href));
                        return (
                            <Link href={item.href} key={item.label} legacyBehavior>
                                <a
                                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 transition-colors hover:bg-white/90 ${isActive ? 'bg-white font-medium text-[#2A59D1] shadow-sm ring-1 ring-slate-200/80' : ''
                                        }`}
                                >
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-current opacity-90">
                                        {typeof Icon === 'string' ? (
                                            <img src={Icon} alt="" className="h-5 w-5" />
                                        ) : (
                                            Icon && <Icon sx={{ fontSize: 20 }} />
                                        )}
                                    </span>
                                    <span
                                        className={`text-sm transition-opacity duration-200 ${!open ? 'sr-only' : ''}`}
                                    >
                                        {item.label}
                                    </span>
                                </a>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div
                className={`mt-auto mb-4 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/90 p-3 shadow-sm ${!open ? 'justify-center px-2' : ''
                    }`}
            >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                    —
                </div>
                {open && (
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-slate-800">Your practice</div>
                        <div className="truncate text-xs text-slate-500">Profile &amp; billing</div>
                    </div>
                )}
            </div>
        </aside>
    );
}
