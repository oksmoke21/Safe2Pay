"use client";
import { ContractForm } from "@/components/common/ContractForm";
import React from "react";
import { Progress } from "@/components/ui/progress";
import { CreateTask } from "@/components/common/CreateTask";
import TaskCard from "@/components/common/TaskCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getAllTasks } from "@/lib/actions/task.actions";

const Page = async({params}) => {
    const router = useRouter();
    const handleSubmit = ()=>{
        router.push(`/tracking/${params.id}`)
    }
    const allTask = await getAllTasks();
  return (
    <div>
      <div className="flex">
        <div className="w-[60%] py-[1.5rem] pr-[7.5rem] pb-[1.9375rem] pl-[5.625rem]">
          <h1 className="text-black font-faktum-test text-[2.25rem] font-bold leading-160 mb-6">
            Review your Task
          </h1>
          <div>
            <p className="text-gray-500 font-inter text-base font-semibold leading-7">
              project name
            </p>
            <h1 className="text-black font-inter text-3xl font-semibold leading-normal">
              My Project
            </h1>
          </div>
          <div>
            <p className="text-gray-500 font-inter text-base font-semibold leading-7 mt-4">
              description
            </p>
            <h1 className="text-black font-inter text-base font-normal leading-7">
              Lorem Ipsum è un testo segnaposto utilizzato nel settore della
              tipografia e della stampa. Lorem Ipsum è considerato il testo
              segnaposto standard sin dal sedicesimo secolo, quando un anonimo
              tipografo prese una cassetta di caratteri e li assemblò per
              preparare un testo campione.
            </h1>
          </div>
          <div className="mt-4">
            {allTask.map((task,key)=><TaskCard task={task} key={task._id}/>)}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSubmit} className="bg-[#FF8C33]">Go to Dashbboard</Button>
          </div>
        </div>
        <div className="w-[40%] flex items-center justify-center">
          <img src="/person.png" className="h-[400px] w-[400px]" />
        </div>
      </div>
    </div>
  );
};

export default Page;
