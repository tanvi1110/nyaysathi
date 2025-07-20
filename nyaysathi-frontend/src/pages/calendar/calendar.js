import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Layout from '../../components/layout/Layout';

export default function CalendarPage() {
    return (
        <Layout>
            <div>
                <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
            </div>
        </Layout>
    );
} 