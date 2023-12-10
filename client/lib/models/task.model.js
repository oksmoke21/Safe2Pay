import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true},
  budget: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date , required: true},
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;