import { ContractForm } from "@/components/common/ContractForm";
import React from "react";
import { Progress } from "@/components/ui/progress"
import { CreateTask } from "@/components/common/CreateTask";
import TaskCard from "@/components/common/TaskCard";
import { getAllTasks } from "@/lib/actions/task.actions";
import { TaskTable } from "@/components/common/TaskTable";

const Page = async() => {
  const allTasks = await getAllTasks();
  const totalBudgetSum = allTasks.reduce((sum, task) => sum + task.budget, 0);

  const outputArray = allTasks.map((item, index) => ({
    id: (index + 1).toString(),
    title: item.taskName,
    date: item.startDate instanceof Date ? item.startDate.toISOString().substring(0, 10) : '', // Convert to string and extract date
    payment: item.budget,
  }));
  
  console.log(allTasks);

  return (
    <div>
      <div className="flex">
        <div className="w-[60%] py-[1.5rem] pr-[7.5rem] pb-[1.9375rem] pl-[5.625rem]">
            <p className="text-gray-400 font-inter text-[1.125rem] font-semibold leading-7 mb-2">project name</p>
            <h1 className="text-gray-700 font-inter text-[2rem] font-semibold leading-7 mb-2">Safe2Pay</h1>
            <p className="text-gray-400 font-inter text-[1.125rem] font-semibold leading-7 mt-4">description</p>
            <h1 className="text-black font-inter text-base font-normal leading-7">
              Lorem Ipsum è un testo segnaposto utilizzato nel settore della
              tipografia e della stampa. Lorem Ipsum è considerato il testo
              segnaposto standard sin dal sedicesimo secolo, quando un anonimo
              tipografo prese una cassetta di caratteri e li assemblò per
              preparare un testo campione.
            </h1>

            <p className="text-gray-400 font-inter text-[1.125rem] font-semibold leading-7 mb-2 mt-4">project name</p>
            <h1 className="text-gray-700 font-inter text-[2rem] font-semibold leading-7 mb-2">$1000</h1>

            </div>
        <div className="w-[40%] flex items-center justify-center">
            <img src="/person.png" className="h-[400px] w-[400px]"/>
        </div>
      </div>
      <div className="mx-20">
        <TaskTable data={outputArray}/>
      </div>
    </div>
  );
};

export default Page;
