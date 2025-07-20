import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 bg-[#F8FAFF] p-6 ml-64 mt-16">{children}</main>
            </div>
        </div>
    );
}
