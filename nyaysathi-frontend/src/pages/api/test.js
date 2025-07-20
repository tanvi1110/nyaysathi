import { connectDB } from "@/src/lib/mongodb";


export default async function handler(req, res) {
    await connectDB();
    res.status(200).json({message: "MongoDB connected successfully"})
} 