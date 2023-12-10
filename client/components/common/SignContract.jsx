"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SignContract = ({ onSubmit,id }) => {
  const [formData, setFormData] = useState({
    inputField: "", // You can add more fields as needed
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the form data to the parent component or a function for further processing
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-4">
        <Input
          type="text"
          name="inputField"
          value={id}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-md"
        />

        {/* Add more input fields and labels as needed */}

        <Button type="submit" className="bg-[#FF8C33]">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default SignContract;
