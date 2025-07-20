import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    address: String,
    dob: String,
});



export default mongoose.models.Contact || mongoose.model('Contact', contactSchema)