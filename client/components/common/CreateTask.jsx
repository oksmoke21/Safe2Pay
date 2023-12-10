"use client";
import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTask } from "@/lib/actions/task.actions";
import { useRouter } from "next/navigation";

export function CreateTask({id}) {
  // State to manage form values
  const [formData, setFormData] = useState({
    taskName: "Project 1",
    date: new Date(),
    budget: 0,
  });
  const router = useRouter()
  const handleNext = ()=>{
      router.push(`/review-contract/${id}`)
  }
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Event handler to update form data when inputs change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setFormData((prevData) => ({ ...prevData, date: newDate }));
  };

  // Submit handler
  const handleSubmit = async() => {
    // You can perform any action with the form data here, such as sending it to a server
    await createTask(formData,id);
    console.log("Form data submitted:", formData);
  };

  return (
    <div>
      <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-[#FF8C33]">Add Tasks</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4 ">
          <div className="">
            <Label htmlFor="taskName" className="text-[#000] font-[600]">
              Task Name
            </Label>
            <Input
              id="taskName"
              value={formData.taskName}
              onChange={handleInputChange}
              className="col-span-3 mt-2"
            />
          </div>
          <div className="">
            <Label htmlFor="date" className="text-[#000] font-[600]">
              Date
            </Label>
           <div className="w-full border border-gray-300 rounded-md">
           <Datepicker
              id="date"
              primaryColor={"fuchsia"} 
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-4" // Adjust the color and styling as needed
            />
           </div>
          </div>
        </div>
        <div className="">
          <Label htmlFor="budget" className="text-[#000] font-[600]">
            Budget
          </Label>
          <Input
            id="budget"
            type="number" // Set the input type to "number" for budget
            value={formData.budget}
            onChange={handleInputChange}
            className="col-span-3 mt-2"
          />
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-[#FF8C33]" onClick={handleSubmit}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <div className="flex justify-center mt-6">
        <Button onClick={handleNext} className="bg-[#FF8C33]">
          Get Started
        </Button>
      </div>
    </div>
  );
}
