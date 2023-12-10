import { ContractForm } from "@/components/common/ContractForm";
import React from "react";
import { Progress } from "@/components/ui/progress"

const Page = () => {
  return (
    <div>
      <div className="flex">
        <div className="w-[60%] py-[1.5rem] pr-[7.5rem] pb-[1.9375rem] pl-[5.625rem]">
            <h1 className="text-black font-faktum-test text-[2.25rem] font-bold leading-160 mb-6">Create a Contract</h1>
            <p className="text-gray-400 font-inter text-[1.125rem] font-semibold leading-7 mb-2">Step 1 of 2</p>
            <h1 className="text-gray-700 font-inter text-[1.5rem] font-semibold leading-7 mb-2">Basic Detail</h1>
            <Progress className="mb-4" value={50} />

          <ContractForm />
        </div>
        <div className="w-[40%] flex items-center justify-center">
            <img src="person.png" className="h-[400px] w-[400px]"/>
        </div>
      </div>
    </div>
  );
};

export default Page;
