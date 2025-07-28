import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    start: {
        type: Date,
        required: [true, 'Start date is required']
    },
    end: {
        type: Date
    },
    allDay: {
        type: Boolean,
        default: false
    },
    location: {
        type: String,
        trim: true
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    }],
    notes: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);


