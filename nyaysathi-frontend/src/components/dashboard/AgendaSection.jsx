import React from 'react';
import Card from '../ui/Card';
import { Button } from '../ui/Button';

const agendaTasks = [
    { text: 'Today I have a important meeting..', done: false },
    { text: 'Today I have a important meeting..', done: false },
    { text: 'Today I have a important meeting..', done: false },
    { text: 'Meeting for Mr. arora is done', done: true },
];

const calendarEvents = [
    { time: '3:00 PM', desc: 'Meeting with the client ashish' },
    { time: '6:00 PM', desc: 'Meeting with the client ashish' },
    { time: '8:00 PM', desc: 'Meeting with the client ashish' },
    { time: '10:00 PM', desc: 'Meeting with the client ashish' },
];

const AgendaSection = () => {
    return (
        <Card className="mb-6 bg-[#E9EDFF] p-6">
            <div className="font-semibold text-xl mb-4">Today's Agenda</div>
            <div className="flex gap-4">
                {/* Task Card */}
                <Card className="flex-1 bg-white">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">0 task today</span>
                        <Button variant="primary" className="!px-3 !py-1 text-xs">+ Add Task</Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {agendaTasks.map((task, i) => (
                            <label key={i} className="flex items-center gap-2 text-sm">
                                <input type="radio" checked={task.done} readOnly className="accent-[#2A59D1]" />
                                <span className={task.done ? 'line-through text-gray-400' : ''}>{task.text}</span>
                            </label>
                        ))}
                    </div>
                </Card>
                {/* Calendar Card */}
                <Card className="flex-1 bg-white">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">0 Calendar Events</span>
                        <Button variant="primary" className="!px-3 !py-1 text-xs">+ Add Event</Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {calendarEvents.map((event, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                                <span className="text-[#2A59D1] w-14 text-right">{event.time}</span>
                                <span>{event.desc}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </Card>
    );
};

export default AgendaSection; 