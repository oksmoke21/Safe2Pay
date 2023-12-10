"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { createProject } from "@/lib/actions/project.actions";

const formSchema = z.object({
  projectName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
});

export function ContractForm() {
  const pathName = usePathname();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
    },
  });

  async function onSubmit(values) {
    try {
      // Create the project
      const createdProject = await createProject(values);
  
      // Check if the project has an _id
      if (createdProject && createdProject._id) {
        // Use the _id in the router.push
        router.push(`/create-contract/${createdProject._id}`);
      } else {
        console.error('Error: Project was created, but no _id found.');
      }
    } catch (error) {
      console.error('Error creating project:', error.message);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-inter text-base font-semibold leading-7">
                project name
              </FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-inter text-base font-semibold leading-7">
                Description
              </FormLabel>
              <FormControl>
                <Textarea placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-inter text-base font-semibold leading-7">
                Your are a..
              </FormLabel>
              <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employer">Employer</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between pt-4">
          <Button
            type="submit"
            className="border border-solid border-[#000] bg-[#fff] text-[#000] px-6"
          >
            Exit
          </Button>

          <Button
            type="submit"
            className="border border-solid border-orange-500 bg-orange-500 rounded-lg p-4"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
