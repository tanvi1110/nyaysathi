import { connectDB } from "@/src/lib/mongodb";
import Task from "@/src/lib/models/Task";

export default async function handler(req, res) {
    const { id } = req.query;
    await connectDB();

    if (req.method === "PUT") {
        const updated = await Task.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
        await Task.findByIdAndDelete(id);
        return res.status(200).end();
    }

    res.status(405).end()

}






