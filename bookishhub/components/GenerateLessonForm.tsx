import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { FormLabel, Form, FormItem, FormField } from './ui/form';
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
            title: '',
            units: ['', '', '']
        },
        resolver: zodResolver(generateTopicsSchema)
    })

    return (
        <div className='w-full'>
            <Form {...form}>
               <form className='mt-4 
                                w-full' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField name='title' control={form.control}
                    render={({field})=>(
                        <FormItem className="flex-col 
                                             sm:flex-row 
                                             flex 
                                             sm:items-center 
                                             w-full 
                                             item-start">
                            <FormLabel className="text-xl 
                                                  flex-{1}">
                                Name of the lesson
                            </FormLabel>
                        </FormItem>
                    )}/>
               </form> 
            </Form>
        </div>
    );
};

export default GenerateLessonForm