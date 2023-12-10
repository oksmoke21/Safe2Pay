import React from "react";

const TaskCard = ({task}) => {
  console.log(task,"taskkkk")
  return (
    <div className="w-full border border-[#FF8C33] rounded-xl p-4 mt-4 mb-4">
      <div>
        <h1 className="text-gray-800 font-inter text-lg font-semibold leading-7">
          Task Name
        </h1>
        <div className="border border-gray-300 rounded-md p-2 mt-2">
          <p className="text-gray-500 font-inter text-base font-normal pl-2">
            {task.taskName}
          </p>
        </div>
      </div>
      <div className="w-full flex gap-4 mt-4">
        <div className="w-[50%]">
          <h1 className="text-gray-800 font-inter text-lg font-semibold leading-7">
            Date
          </h1>
          <div className="border border-gray-300 rounded-md p-2 mt-2">
            <p className="text-gray-500 font-inter text-base font-normal pl-2">
              {task.startDate.toISOString().split('T')[0]} to {task.endDate.toISOString().split('T')[0]}
            </p>
          </div>
        </div>
        <div className="w-[50%]">
          <h1 className="text-gray-800 font-inter text-lg font-semibold leading-7">
            Budget
          </h1>
          <div className="border border-gray-300 rounded-md p-2 mt-2">
            <p className="text-gray-500 font-inter text-base font-normal pl-2">
              {task.budget}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
