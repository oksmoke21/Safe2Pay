"use server";

import Task from "../models/task.model";
import { revalidatePath } from "next/cache";
import Project from "../models/project.model";
import { connectToDB } from "../mongoose";

export const createTask = async (taskData, projectId) => {
    try {
      // Connect to the database
      connectToDB();
  
      // Create a new task with the project reference
      const createdTask = await Task.create({
        taskName: taskData.taskName,
        budget: taskData.budget,
        startDate: taskData.date.startDate,
        endDate: taskData.date.endDate,
        project: projectId, // Set the project reference
      });
      const populatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $push: { tasks: createdTask._id } }, // Push the new task's _id to the tasks array
        { new: true } // Return the modified project document
      ).populate('tasks');
      // Revalidate the path
  
      console.log('Task created successfully:', createdTask);
      return createdTask;
    } catch (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  };
  export const getAllTasks = async () => {
    try {
      // Connect to the database
      connectToDB();
      const tasks = await Task.find();
      return tasks;
    } catch (error) {
      throw new Error(`Failed to get tasks: ${error.message}`);
    }
  };

  export const getTaskById = async (taskId) => {
    try {
      // Connect to the database
      connectToDB();
  
      // Fetch the project by ID
      const task = await Task.findById(taskId);
  
      if (!task) {
        throw new Error('Task not found');
      }
      return task;
    } catch (error) {
      throw new Error(`Failed to get task: ${error.message}`);
    }
  };