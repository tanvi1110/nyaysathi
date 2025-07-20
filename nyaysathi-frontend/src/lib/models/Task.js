import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        status: {
            type: String,
            enum: ['Pending', 'Completed'],
            default: 'Pending',
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Contact'
        },
        assignedBy:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Contact'
        },
        priority: {
            type: String,
            enum: ['High', 'Normal', 'Low'],
            default: 'Normal'
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }, { timestamps: true }
)

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);