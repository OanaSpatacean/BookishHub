'use client';
import { createLanguageSchema } from "@/app/form-validators/language";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast, useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";

type Input = z.infer<typeof createLanguageSchema>;

const EditLanguagesClient = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newName, setNewName] = useState("");

    const form = useForm<Input>({
        resolver: zodResolver(createLanguageSchema),
        defaultValues: { name: '' }
    })

    const { mutate: createLanguage } = useMutation({
        mutationFn: async (data: Input) => {
            const response = await axios.post('/api/admin/edit_assessments/languages', data);
            return response.data;
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Language created successfully" });
            form.reset();
            setIsLoading(false);
            window.location.reload();
        },
        onError: () => {
            toast({ title: "Warning", description: "Failed to create language", variant: "destructive" });
        }
    })

    const handleCreateSubmit = (data: Input) => {
        createLanguage(data)
    }

    const { data, refetch } = useQuery({
        queryKey: ["languages"],
        queryFn: async () => {
            const response = await axios.get("/api/admin/edit_assessments/languages");
            return response.data;
        }
    });
    
    const languages = data?.languages ?? []; 
    
    const { mutate: deleteLanguage } = useMutation({
        mutationFn: async (id: number) => {
            setLoadingId(id);
            const response = await axios.delete(`/api/admin/edit_assessments/languages`, { data: { id } })
            return response.data
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Language deleted successfully" });
            refetch();
            setLoadingId(null)
        },
        onError: () => {
            toast({ title: "Warning", description: "Failed to delete language", variant: "destructive" });
            setLoadingId(null)
        }
    })

    const { mutate: updateLanguage, isLoading: isUpdating } = useMutation({
        mutationFn: async ({ id, name }: { id: number, name: string }) => {
            await axios.put(`/api/admin/edit_assessments/languages`, { id, name });
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Language updated successfully" });
            refetch();
            setEditingId(null);
        },
        onError: () => {
            toast({ title: "Warning", description: "Failed to update language", variant: "destructive" });
        }
    })

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

            <h2 className="text-2xl 
                           font-semibold                      
                           mt-8">
                Languages displayed on the platform:
            </h2>

            <div className="w-full 
                            flex 
                            flex-col 
                            gap-5 
                            mt-6
                            mb-5">
                {languages?.map((language) => (
                    <div key={language.id} className="rounded-lg 
                                                      border 
                                                      p-4 
                                                      flex 
                                                      items-center 
                                                      bg-gray-50 
                                                      dark:bg-gray-900 
                                                      w-full">
                        <div className="flex-grow">
                            <h3 className="text-primary 
                                           truncate 
                                           font-semibold 
                                           text-lg">
                                {language.name}
                            </h3>
                        </div>
                        <div className="justify-end 
                                        flex">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="underline 
                                                       text-blue-500 
                                                       block 
                                                       w-fit 
                                                       mr-5">
                                        Update
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="p-4">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block 
                                                              text-sm 
                                                              font-medium">
                                                Update language name
                                            </label>

                                            <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="border 
                                                                                                                           rounded 
                                                                                                                           p-2 
                                                                                                                           w-full"/>
                                        </div>
                                        
                                        <Button onClick={() => updateLanguage({ id: language.id, name: newName })} className="w-full" disabled={isUpdating}>
                                            {isUpdating ? "Updating..." : "Save"}
                                        </Button>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            
                            <button onClick={() => deleteLanguage(language.id)} className="underline 
                                                                                           text-red-500 
                                                                                           block 
                                                                                           w-fit 
                                                                                           disabled:opacity-50" disabled={loadingId === language.id}>
                                {loadingId === language.id ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EditLanguagesClient;
