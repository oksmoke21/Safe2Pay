"use server";

import Project from "../models/project.model";
import { connectToDB } from "../mongoose";

export const createProject = async (taskData) => {
  try {
    // Connect to the database
    connectToDB();
    // Create a new project by providing the required fields
    const createdProject = await Project.create({
      projectName: taskData.projectName,
      description: taskData.description,
      role: taskData.role,
    });

    console.log('Project created successfully:', createdProject);
    return createdProject;
  } catch (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }
};


export const getAllProjects = async () => {
    try {
      // Connect to the database
      connectToDB();
  
      // Fetch all tasks
      const tasks = await Project.find();
  
      return tasks;
    } catch (error) {
      throw new Error(`Failed to get tasks: ${error.message}`);
    }
};

export const getProjectById = async (taskId) => {
    try {
      // Connect to the database
      connectToDB();
  
      // Fetch the task by ID
      const task = await Project.findById(taskId);
  
      if (!task) {
        throw new Error('Task not found');
      }
  
      return task;
    } catch (error) {
      throw new Error(`Failed to get task: ${error.message}`);
    }
};
