'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { FormControl, FormLabel, Form, FormItem, FormField } from './ui/form';
import { generateTopicsSchema } from '@/app/form-validators/lesson';
import { useForm } from 'react-hook-form';
import React from 'react'

type Input = z.infer<typeof generateTopicsSchema>
type Props = {}

const GenerateLessonForm = (props:Props) => {
    function onSubmit (data:Input){
        console.log(data);
    }
    
    const form = useForm<Input>({
        defaultValues: {
            name: '',
            modules: ['', '', '', '']
        },
        resolver: zodResolver(generateTopicsSchema)
    });

    form.watch();

    return (
        <div className='w-full'>
            <Form {...form}>
               <form className='mt-3 
                                w-full' 
                    onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name='name' render={({field})=>(
                        <FormItem className="flex-col 
                                             sm:flex-row 
                                             flex 
                                             sm:items-center 
                                             w-full 
                                             item-start">
                            <FormLabel className="text-xl 
                                                  flex-{3} 
                                                  mr-10">
                                Name
                            </FormLabel>
                            <FormControl className="flex-[5]">
                                <Input placeholder="Specify the primary subject of the lesson" />
                            </FormControl>
                        </FormItem>
                    )}/>
                    <AnimatePresence>
                        {form.watch('modules')
                            .map((_, index) => {
                                return (
                                    <motion.div>
                                        <FormField control={form.control} name={`modules.${index}`} key={index} render={({ field }) => {
                                        return (
                                            <FormItem className='sm:flex-row 
                                                                sm:items-center 
                                                                items-start 
                                                                flex-col 
                                                                flex 
                                                                w-full'>
                                                <FormLabel className="mr-3 
                                                                    flex-{1} 
                                                                    text-xl">
                                                    Module {index + 1}
                                                </FormLabel>
                                                <FormControl className="flex-[6]">
                                                    <Input placeholder={`Specify a module of the lesson`} {...field} />
                                                </FormControl>
                                            </FormItem>
                                        );
                                    }} />
                                    </motion.div>
                                    );
                        })}
                    </AnimatePresence>
                    <div className='mt-5 
                                    justify-center 
                                    items-center 
                                    flex'>
                        <Separator className='flex-{1}'/>
                        <div className='mx-3'>
                            <Button variant='secondary' type='button' className='ml-3 
                                                                                 font-semibold  
                                                                                 w-40'
                                onClick={()=>{form.setValue('modules',[...form.watch('modules')
                                                                                .slice(0,-1)])}}>
                                <Minus className='h-3 
                                                  w-3  
                                                  text-orange-600
                                                  ml-3'/>
                                Delete module
                            </Button>
                        </div>
                        <div className='mx-3'>
                            <Button variant='secondary' type='button' className='font-semibold 
                                                                                 w-40' 
                                onClick={()=>{form.setValue('modules',[...form.watch('modules'), ""])}}>
                                <Plus className='h-3 
                                                 w-3  
                                                 text-blue-600
                                                 ml-3'/>
                                Insert module
                            </Button>
                        </div>
                        <Separator className='flex-{1}'/>
                    </div>
               </form> 
            </Form>
        </div>
    );
};

export default GenerateLessonForm