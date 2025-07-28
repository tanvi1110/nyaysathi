import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import { Contacts, Edit, EditCalendar, FormatListBulleted, Language, QrCodeScanner, Settings } from '@mui/icons-material';
const navItems = [
    { label: 'Dashboard', icon: HomeFilledIcon, href: '/' },
    { label: 'Calendar', icon: EditCalendar, href: '/calendar/calendar' },
    { label: 'Tasks', icon: FormatListBulleted, href: '/task/task' },
    { label: 'Contacts', icon: Contacts, href: '/contact/contact' },
    { label: 'AI Summarizer', icon: QrCodeScanner, href: 'ai-summarizer/ai-summarizer' },
    { label: 'Legal Notes / Drafts', icon: Edit, href: '/legal-notes/legal-notes' },
    { label: 'Language Translation', icon: Language, href: '/language-translation' },
    { label: 'Settings', icon: Settings, href: '#' },
];

export default function Sidebar() {
    const [open, setOpen] = useState(true);
    const router = useRouter();

    return (
        <aside className={`fixed left-0 top-0 h-full w-64 bg-[#F4F5FF] border-r border-[#E5E7EB] p-4 justify-between transition-all duration-300 z-40 ${open ? '' : 'w-20'}`}>
            <div>
                <div className="flex items-center mb-12 relative">
                    <span className={`font-semibold text-lg text-gray-800 transition-all duration-300 ${!open ? 'opacity-0 w-0' : ''}`}>Legal Advisor</span>
                    <button
                        className={`ml-auto text-xl text-gray-400 transition-transform duration-300 ${open ? '' : 'rotate-180'}`}
                        onClick={() => setOpen((prev) => !prev)}
                        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
                    >
                        &lt;
                    </button>
                </div>
                <nav className="flex flex-col gap-4">
                    {navItems.map((item) => {
                        const isActive = router.pathname === item.href || (item.href !== '/' && router.pathname.startsWith(item.href));
                        return (
                            <Link href={item.href} key={item.label} legacyBehavior>
                                <a className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-[#E0E7FF] transition ${isActive ? 'bg-[#E0E7FF]' : ''}`}>
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        {typeof item.icon === 'string'
                                            ? <img src={item.icon} alt="" className="w-5 h-5" />
                                            : item.icon && <item.icon fontSize="small" />}
                                    </span>
                                    <span className={`text-sm font-medium transition-all duration-300 ${!open ? 'opacity-0 w-0' : ''}`}>{item.label}</span>
                                </a>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg bg-[#E0E7FF] mt-8 transition-all duration-300 ${!open ? 'justify-center' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">TS</div>
                {open && (
                    <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">Tanvi Shah</div>
                    </div>
                )}
                {open && <span className="text-gray-400">&gt;</span>}
            </div>
        </aside>
    );
}
