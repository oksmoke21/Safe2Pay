"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function CreateContract() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/create-contract')
  };

  return (
    <main className="">
      <div className="flex justify-between mr-[7.5rem] ml-[5.625rem] mt-10">
        <h1 className="text-[#000] text-[2.5rem] font-[700]">
          Your Contracts
        </h1>
        <div>
          <Button onClick={handleClick} className="bg-[rgb(255,140,51)] text-[#000] px-10">
            create
          </Button>
        </div>
      </div>
    </main>
  );
}
