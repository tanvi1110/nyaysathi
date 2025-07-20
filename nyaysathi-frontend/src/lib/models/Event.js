import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: String,
    description: String,
    start: String,
    end: String,
    location: String,
    attendees: [String],
    color: String,
    allDay: Boolean,
    recurring: Boolean,
    recurringType: String,
    notes: String,
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);


