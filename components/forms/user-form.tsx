"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { fr, is } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DateRange } from "react-day-picker";
import { isValid } from "date-fns";
import { cn } from "@/lib/utils";
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
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/Modal";
import { User, ModalInfomation, Company } from "@/Types/types";

import { PresetSelector } from "@/components/ui/preset-selector";
import Spinner from "../ui/spinner";
import { CompanyFormEdit } from "./company-form";

const profileFormSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    companyName: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserFormEditProps {
    userData: User;
    isNew: boolean;
    setOpen: (open: boolean) => void;
    onUpdate: (updatedUser: User, isNew: boolean) => void;
}

export const UserFormEdit: React.FC<UserFormEditProps> = ({
    userData,
    setOpen,
    onUpdate,
    isNew,
}) => {
    const { toast } = useToast();
    const handleClose = () => {
        setOpen(false);
    };
    const domain = typeof window !== "undefined" ? window.location.origin : "";
    const [showModal, setShowModal] = useState(false);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedPreset, setSelectedPreset] = React.useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    const [modalInfomation, setModalInfomation] = useState<ModalInfomation>({
        modalType: "",
        title: "",
        modalBody: "",
        buttonText: "",
    });

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),

        defaultValues: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
        },
        mode: "onChange",
    });

    const baseURL =
        process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_PROD
            : process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_DEV;
    useEffect(() => {
        axios
            .get(`${baseURL}api/companies/`)
            .then(response => {
                const updatedCompanies = response.data.companies.map(
                    ({ companyName, id, ...company }: Company) => ({
                        ...company,
                        name: companyName,
                        id: id,
                    })
                );
                setCompanies(updatedCompanies);
                if (isNew) {
                    setSelectedPreset(updatedCompanies[0]);
                    setIsLoading(false);
                }
            })
            .catch(error => console.error("Error:", error));
    }, [baseURL]);

    useEffect(() => {
        console.log("userData.company", userData.company);
        if (!isNew && companies) {
            const selectedCompany = companies.find(
                company => company.id === userData.company.id
            );
            setSelectedPreset(selectedCompany);
            if (selectedCompany) {
                setIsLoading(false);
            }
        }
    }, [isNew, userData, companies]);
    async function onSubmit(data: ProfileFormValues) {
        try {
            const payload = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                companyId: selectedPreset.id,
            };

            let response;
            if (isNew) {
                response = await axios.post(
                    `${baseURL}api/users/create`,
                    payload
                );
            } else {
                response = await axios.post(
                    `${baseURL}api/users/update/${userData.id}`,
                    payload
                );
            }

            handleClose();

            if (isNew) {
                toast({
                    description: `The User has been created successfully`,
                });
                onUpdate(response.data.createdUser, true);
            } else {
                toast({
                    description: `The User has been updated successfully`,
                });
                onUpdate(response.data.user, false);
            }
        } catch (error) {
            console.error(error);
            toast({
                title: `An error occurred.`,
                description: `Unable to create the User. Please try again later.`,
            });
        }
    }

    return (
        <>
            {isLoading ? (
                <Spinner className='flex justify-center' /> // Render the spinner if isLoading is true
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8'>
                        <FormField
                            control={form.control}
                            name='companyName'
                            render={({ field }) => (
                                <FormItem className='w-1/2 mr-2'>
                                    <FormLabel className='mr-4'>
                                        Company
                                    </FormLabel>
                                    <PresetSelector
                                        presets={companies}
                                        selectedPreset={selectedPreset}
                                        setSelectedPreset={setSelectedPreset}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='firstName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='First Name....'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='lastName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Last Name....'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Please Enter the contact Email....'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex w-full justify-end'>
                            <Button
                                variant='outline'
                                onClick={handleClose}
                                className='mr-2'
                                type='button'>
                                Annuler
                            </Button>

                            {isNew ? (
                                <Button type='submit' className='flex'>
                                    Create
                                </Button>
                            ) : (
                                <Button type='submit' className='flex'>
                                    Update
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
                href='/'
                modalTitle={modalInfomation.title}
                modalBody={modalInfomation.modalBody}
                buttonText={modalInfomation.buttonText}
            />
        </>
    );
};
