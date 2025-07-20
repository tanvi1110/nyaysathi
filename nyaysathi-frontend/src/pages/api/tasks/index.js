import { connectDB } from "@/src/lib/mongodb";
import Task from "@/src/lib/models/Task";

export default async function handler(req, res) {
   try {
      await connectDB();

      if (req.method === "GET") {
         const tasks = await Task.find({}).populate('assignedBy assignedTo');
         return res.status(200).json(tasks);
      }

      if (req.method === "POST") {
         // Temporary: Drop and recreate collection to apply new schema
         if (req.body.resetCollection) {
            await Task.collection.drop();
            console.log('Task collection dropped and will be recreated');
            return res.status(200).json({ message: 'Collection reset successfully' });
         }

         console.log('=== TASK CREATION DEBUG ===');
         console.log('Request body:', req.body);
         console.log('Task model schema paths:', Object.keys(Task.schema.paths));

         const taskData = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            priority: req.body.priority,
            assignedTo: req.body.assignedTo || '',
            assignedBy: req.body.assignedBy || ''
         };
         console.log('Processed task data:', taskData);
         console.log('Description field value:', taskData.description);

         const newTask = await Task.create(taskData);
         const populatedTask = await Task.findById(newTask._id).populate('assignedBy assignedTo');
         console.log('Created task in DB:', newTask);
         console.log('Created task JSON:', JSON.stringify(newTask, null, 2));
         console.log('Task ID:', newTask._id);
         console.log('Task description field:', newTask.description);
         console.log('Task description field type:', typeof newTask.description);
         console.log('=== END DEBUG ===');

         return res.status(201).json(populatedTask);
      }

      if (req.method === "DELETE") {
         await Task.deleteMany({});
         return res.status(200).json({ message: 'All tasks deleted successfully' });
      }

      return res.status(405).json({ message: 'Method not allowed' });
   } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ message: 'Internal server error' });
   }
} 
