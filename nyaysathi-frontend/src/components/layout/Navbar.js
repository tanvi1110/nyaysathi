import { Add, NotificationAdd, Notifications, Pause, PlayArrow, PlusOne } from "@mui/icons-material";
import { Button } from "../ui/Button";

export default function Navbar() {
    return (
        <header className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 flex items-center justify-between bg-[#F4F5FF] px-8 border-b border-[#E5E7EB] z-50">
            {/* Search Bar */}
            <div className="flex-1 max-w-xs">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full rounded-md bg-white border border-[#E5E7EB] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
            </div>
            {/* Right Side Buttons */}
            <div className="flex items-center gap-4 ml-8">
                {/* Timer Button */}
                <Button variant="primary">
                    <PlayArrow className="w-3 h-3" />
                    00:00:00
                </Button>
                {/* Create New Button */}
                <Button variant="primary">Create new <Add /></Button>
                {/* Notification/User Icon */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2A59D1] hover:bg-[#002D9F] cursor-pointer border border-[#E5E7EB]">
                    <Notifications />
                </div>
            </div>
        </header>
    );
}
