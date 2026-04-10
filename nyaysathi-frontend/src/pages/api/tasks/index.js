import { connectDB } from "@/src/lib/mongodb";
import Task from "@/src/lib/models/Task";
import mongoose from "mongoose";
import { devStore } from "@/src/lib/devStore";

function pickObjectId(value) {
   if (value == null || value === "") return undefined;
   if (typeof value !== "string") return undefined;
   return mongoose.Types.ObjectId.isValid(value) ? value : undefined;
}

export default async function handler(req, res) {
   try {
      try {
         await connectDB();
      } catch (e) {
         // Dev fallback when MongoDB/Atlas is unreachable (e.g. ECONNREFUSED on SRV lookup)
         const store = devStore();
         if (req.method === "GET") {
            return res.status(200).json(store.list("tasks"));
         }
         if (req.method === "POST") {
            const task = store.create("tasks", {
               title: req.body?.title,
               description: req.body?.description,
               status: req.body?.status || "Pending",
               priority: req.body?.priority || "Normal",
               assignedTo: req.body?.assignedTo || "",
               assignedBy: req.body?.assignedBy || "",
            });
            return res.status(201).json(task);
         }
         if (req.method === "DELETE") {
            if (process.env.ALLOW_DB_RESET !== "true") {
               return res.status(403).json({ message: "Bulk delete is disabled" });
            }
            // clear
            global.__nyaysathiDevStore.tasks = [];
            return res.status(200).json({ message: "All tasks deleted successfully" });
         }
         return res.status(503).json({ message: "Database unavailable (dev fallback active)" });
      }

      if (req.method === "GET") {
         const tasks = await Task.find({}).populate("assignedBy assignedTo");
         return res.status(200).json(tasks);
      }

      if (req.method === "POST") {
         if (req.body?.resetCollection) {
            if (process.env.ALLOW_DB_RESET !== "true") {
               return res.status(403).json({ message: "Collection reset is disabled" });
            }
            await Task.collection.drop();
            return res.status(200).json({ message: "Collection reset successfully" });
         }

         const taskData = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            priority: req.body.priority,
         };

         const assignedTo = pickObjectId(req.body.assignedTo);
         const assignedBy = pickObjectId(req.body.assignedBy);
         if (assignedTo) taskData.assignedTo = assignedTo;
         if (assignedBy) taskData.assignedBy = assignedBy;

         const newTask = await Task.create(taskData);
         const populatedTask = await Task.findById(newTask._id).populate("assignedBy assignedTo");
         return res.status(201).json(populatedTask);
      }

      if (req.method === "DELETE") {
         if (process.env.ALLOW_DB_RESET !== "true") {
            return res.status(403).json({ message: "Bulk delete is disabled" });
         }
         await Task.deleteMany({});
         return res.status(200).json({ message: "All tasks deleted successfully" });
      }

      return res.status(405).json({ message: "Method not allowed" });
   } catch (error) {
      console.error("Tasks API error:", error);
      return res.status(500).json({ message: "Internal server error" });
   }
}
