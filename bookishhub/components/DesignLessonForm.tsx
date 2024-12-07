'use client'
import { useRouter } from "next/navigation";
import { toast, useToast } from "./ui/use-toast";
import axios from "axios";
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MinusCircle, PlusCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { FormControl, FormLabel, Form, FormItem, FormField } from './ui/form';
import { designTopicsSchema } from '@/app/form-validators/lesson';
import { useForm } from 'react-hook-form';
import React from 'react'

type Input = z.infer<typeof designTopicsSchema>
type Props = {}

const DesignLessonForm = (props:Props) => {
    const { toast } = useToast();

    const {mutate: designTopics, isLoading} = useMutation({
        mutationFn: async ({name, modules}: Input) => {
          const response = await axios.post("/api/lesson/designTopics", {name, modules});
          return response.data;}
    });

    const router = useRouter();

    function onSubmit (data:Input){
        if (data.name.length < 3) {
            toast({ title: "Warning", description: "Name must contain at least 3 characters", variant: "destructive" });
            return;
        }

        if (data.modules.some((module) => module === "")) {
            toast({title: "Warning", description: "All modules must be completed", variant: "destructive"});
            return;}

        designTopics(data, {
            onSuccess: ({lessonId}) => {
                toast({title: "Done", description: "Topics created with success"});
                router.push(`/design/${lessonId}`);
              },
            onError: (error) => {
              console.error(error);
              toast({title: "Warning", description: "An error occurred", variant: "destructive"});       
            },
          });
        }

    const form = useForm<Input>({
        defaultValues: {
            name: '',
            modules: ['', '', '', '']
        },
        resolver: zodResolver(designTopicsSchema)
    });

    form.watch();

    return (
        <div className='w-full 
                        mb-6'>
            <Form {...form}>
               <form className='mt-3 
                                w-full 
                                mt-6' 
                    onSubmit={(e) => { e.preventDefault(); onSubmit(form.getValues()); }}>

                    <FormLabel className="text-xl 
                                          flex-{3} 
                                          mr-10
                                          mb-6
                                          text-bold">
                                Specify the primary subject of the lesson
                    </FormLabel>

                    <FormField control={form.control} name='name' render={({field})=>(
                        <FormItem className="flex-col 
                                             sm:flex-row 
                                             flex 
                                             sm:items-center 
                                             w-full 
                                             item-start 
                                             mb-4">
                            <FormControl className="flex-[6] 
                                                    mb-1
                                                    mt-1">
                                <Input placeholder="Name" {...field}/>
                            </FormControl>
                        </FormItem>
                    )}/>
                    
                    <FormLabel className="text-xl 
                                          flex-{3} 
                                          mr-10
                                          mb-1
                                          text-bold">
                                Specify the modules of the lesson
                    </FormLabel>
                    
                    <AnimatePresence>
                        {form.watch('modules').map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex 
                                           items-center 
                                           gap-4 
                                           mb-4"
                            >
                                <Input
                                    placeholder={`Module ${index + 1}`}
                                    {...form.register(`modules.${index}` as const)}
                                    className="flex-grow
                                               mt-1"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        const modules = form.watch('modules');
                                        form.setValue('modules', modules.filter((_, i) => i !== index));
                                    }}
                                    className="text-red-500"
                                >
                                    <MinusCircle className="h-5 
                                                            w-5" />
                                </Button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <div className="flex 
                                    items-center">
                        <div className="flex-grow"></div>
                        <Button
                            variant="secondary"
                            type="button"
                            className="font-semibold 
                                       h-8 
                                       px-4 
                                       w-full"
                            onClick={() => {
                                form.setValue("modules", [...form.watch("modules"), ""]);
                            }}
                        >
                            <PlusCircle className="text-green-400
                                                   h-4 
                                                   w-1 
                                                   mr-2"/>
                            Insert new module
                        </Button>
                    </div>
                    
                    <Button size='lg' className='mt-6 w-full' type='submit' disabled={isLoading}>
                        Start designing your lesson
                    </Button>
               </form> 
            </Form>
        </div>
    );
};

export default DesignLessonForm