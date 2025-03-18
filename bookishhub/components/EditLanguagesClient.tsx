'use client';
import { createLanguageSchema } from "@/app/form-validators/language";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast, useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Input = z.infer<typeof createLanguageSchema>;

const EditLanguagesClient = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<Input>({
        resolver: zodResolver(createLanguageSchema),
        defaultValues: { name: '' }
    })

    const { mutate: createLanguage } = useMutation({
        mutationFn: async (data: Input) => {
            const response = await axios.post('/api/admin/edit_assessments/language', data);
            return response.data;
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Language created successfully" });
            form.reset();
            setIsLoading(false);
        },
        onError: () => {
            toast({ title: "Warning", description: "Failed to create language", variant: "destructive" });
        }
    })

    const handleCreateSubmit = (data: Input) => {
        createLanguage(data)
    }

    return (
        <div className="flex 
                        flex-col 
                        items-start 
                        w-full 
                        px-4 
                        max-w-none 
                        mt-7">
            <h1 className="sm:text-5xl 
                           text-left 
                           font-bold 
                           text-3xl 
                           underline 
                           decoration-4 
                           decoration-gray-500">
                Manage languages available on the website
            </h1>

            <div className="bg-secondary 
                            border-none 
                            p-4 
                            flex  
                            mt-7">
                <div className="flex-shrink-0">
                    <InfoIcon className="text-green-500 
                                         h-10 
                                         w-10 
                                         bg-green-100 
                                         rounded-full 
                                         p-2 
                                         shadow-sm"/>
                </div>

                <div className="ml-5">
                    On this page, you can manage all the languages available for use on the platform. Add what language you want for the user to explore or edit the existing ones that are already displayed.
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateSubmit)} className="space-y-6 
                                                                                  bg-white 
                                                                                  p-6 
                                                                                  rounded-md 
                                                                                  shadow-md 
                                                                                  w-full 
                                                                                  mt-4 
                                                                                  dark:bg-gray-900">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Language name" {...field} />
                            </FormControl>
                        </FormItem>
                    )}/>

                    <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Adding new language...' : 'Add new language'}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default EditLanguagesClient;
