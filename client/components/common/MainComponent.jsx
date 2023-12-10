"use client";
import React from 'react'
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const MainComponent = () => {
    const router = useRouter()
    const handleSubmit = ()=>{
      router.push('/projects')
    }
  return (
    <div>
        <div className="flex justify-center">
        <img src="/person.png" className="h-[400px] w-[400px]" />
      </div>
      <h1 className='text-center  font-faktum-test text-[2.35rem] font-bold leading-3.87738 tracking-wide text-gray-800'>Making Payments between Freelancers <br/>and clients Easy</h1>

      <div className="flex justify-center mt-6">
        <Button onClick={handleSubmit} className="bg-[#FF8C33]">
          Get Started
        </Button>
      </div>
    </div>
  )
}

export default MainComponent