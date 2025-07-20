import { connectDB } from "@/src/lib/mongodb";
import Contact from "@/src/lib/models/Contact";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        try {
            const contacts = await Contact.find();
            return res.status(200).json(contacts);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch contacts' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, email, phone, address, dob } = req.body;

            // Check if contact already exists by email OR phone
            const existing = await Contact.findOne({
                $or: [{ email }, { phone }],
            });

            if (existing) {
                return res.status(400).json({ error: "Contact already exists" });
            }

            const contact = await Contact.create({ name, email, phone, address, dob });
            return res.status(201).json(contact);
        } catch (error) {
            console.error("Error creating contact:", error);
            return res.status(500).json({ error: "Failed to create contact" });
        }
    }

    return res.status(405).end()
}














