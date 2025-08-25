"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Modal from "@/components/ui/Modal";
import {
    ModalInfomation,
    Workflow,
    ConditionItem,
    WorkflowAutomation,
    WfData,
    TaskData,
    DecisionData,
    IndexField,
} from "@/Types/types";
import { Separator } from "@/components/ui/separator";
import ConditionComponent from "@/components/forms/conditionds-component";

import { PresetSelector } from "@/components/ui/preset-selector";
import { PlusIcon } from "@radix-ui/react-icons";
import Spinner from "@/components/ui/spinner";
import { useForm, useFieldArray } from "react-hook-form";
import { de, is } from "date-fns/locale";
import { set } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PasswordInput } from "@/components/ui/password-input";

export const formSchema = z.object({
    ecmBaseURL: z.string(),
    publickey: z.string(),
    userName: z.string(),
    password: z.string(),
    apiKey: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;

interface ConnectionProps {
    ecmBaseURL: string;
    publickey: string;
    userName: string;
    password: string;
    apiKey: string;
}

export const ConnectionForm: React.FC<ConnectionProps> = ({
    ecmBaseURL,
    publickey,
    userName,
    password,
    apiKey,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [modalInfomation, setModalInfomation] = useState<ModalInfomation>({
        modalType: "",
        title: "",
        modalBody: "",
        buttonText: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ConnectionProps>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ecmBaseURL: ecmBaseURL ?? "",
            publickey: publickey ?? "",
            userName: userName ?? "",
            password: password ?? "",
            apiKey: apiKey ?? "",
        },
        mode: "onChange",
    });

    const {
        register,
        handleSubmit,
        setValue,

        formState: { errors },
    } = form;

    const baseURL =
        process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_PROD
            : process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_DEV;

    async function onSubmit(formData: FormValues) {
        try {
            console.log(formData);

            setIsLoading(true);
            const response = await axios.post(
                `${baseURL}api/workflows/create-workflow-automation/`,
                {
                    ...formData,
                }
            );
            setModalInfomation({
                modalType: "success",
                title: "Success!",
                modalBody: (
                    <div className='flex w-full max-w-sm items-center space-x-2'>
                        <p className='text-sm text-gray-600'>
                            The automation has been created successfully.
                        </p>
                    </div>
                ),
                buttonText: "Back to Workflow automation",
            });
            setIsLoading(false);
            setShowModal(true);
        } catch (error) {
            console.error(error);
            setModalInfomation({
                modalType: "error",
                title: "An error occurred while creating the workflow.",
                modalBody: (
                    <p>
                        {(error as any).response?.data?.message ??
                            "Please try again later."}
                    </p>
                ),
                buttonText: "Close",
            });
            setIsLoading(false);
            setShowModal(true); // Show the modal
        }
    }

    return (
        <>
            {isLoading ? (
                <Spinner className='flex justify-center' /> // Render the spinner if isLoading is true
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='space-y-8'>
                        <FormField
                            control={form.control}
                            name='ecmBaseURL'
                            render={({ field, fieldState: { error } }) => (
                                <FormItem className='w-1/2 mr-2'>
                                    <FormLabel>ECM Url</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='ECM URL...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    {error && (
                                        <FormMessage>
                                            {error.message}
                                        </FormMessage>
                                    )}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='publickey'
                            render={({ field, fieldState: { error } }) => (
                                <FormItem className='w-1/2 mr-2'>
                                    <FormLabel>ECM Public Key</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='ECM Public Key'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    {error && (
                                        <FormMessage>
                                            {error.message}
                                        </FormMessage>
                                    )}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='userName'
                            render={({ field, fieldState: { error } }) => (
                                <FormItem className='w-1/2 mr-2'>
                                    <FormLabel>ECM username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Username...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    {error && (
                                        <FormMessage>
                                            {error.message}
                                        </FormMessage>
                                    )}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field, fieldState: { error } }) => (
                                <FormItem className='w-1/2 mr-2'>
                                    <FormLabel>ECM password</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            placeholder='Password...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    {error && (
                                        <FormMessage>
                                            {error.message}
                                        </FormMessage>
                                    )}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='apiKey'
                            render={({ field, fieldState: { error } }) => (
                                <FormItem className='w-1/2 mr-2'>
                                    <FormLabel>ECM Apikey</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Api Key...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    {error && (
                                        <FormMessage>
                                            {error.message}
                                        </FormMessage>
                                    )}
                                </FormItem>
                            )}
                        />
                        <div className='flex w-full justify-end'>
                            <Link
                                className={`${buttonVariants({
                                    variant: "destructive",
                                })} mr-2`}
                                href='/'>
                                Cancel
                            </Link>
                            {isLoading ? (
                                <Button type='submit' className='flex' disabled>
                                    <Spinner
                                        className='mr-2'
                                        spinnerClassName='w-4 h-4 text-white animate-spin'
                                    />
                                    Pending...
                                </Button>
                            ) : (
                                <Button
                                    type='submit'
                                    className='flex'
                                    disabled={!form.formState.isValid}>
                                    Save
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            )}
            <Modal
                modalType={modalInfomation.modalType}
                open={showModal}
                setOpen={setShowModal}
                href='/ecm/connection'
                modalTitle={modalInfomation.title}
                modalBody={modalInfomation.modalBody}
                buttonText={modalInfomation.buttonText}
            />
        </>
    );
};
