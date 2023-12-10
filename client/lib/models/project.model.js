import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectName: { type: String},
  description:{type:String},
  role:{type:String},
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
