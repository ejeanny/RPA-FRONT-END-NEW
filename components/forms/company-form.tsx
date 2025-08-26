"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { addDays, format } from "date-fns";
import { fr, is } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Controller } from "react-hook-form";
import { DateRange } from "react-day-picker";
import { isValid } from "date-fns";
import { cn } from "@/lib/utils";
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
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Calendar as CalendarIcon,
    ChevronRightIcon,
    ClipboardCopy,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Modal from "@/components/ui/Modal";
import { Company, User, ModalInfomation } from "@/Types/types";
const profileFormSchema = z.object({
    companyName: z.string(),
    companyEmail: z.string().email(),
    numberOfDocuments: z.enum(["1000", "5000", "10000"]), // Replace these options with the actual values from your select list
    companyPlan: z.enum(["Monthly", "Yearly", "Trial", "Partner"]), // Replace these options with the actual values from your select list
});

const planType = ["Monthly", "Yearly", "Trial", "Partner"];
const documentPlan = ["1000", "5000", "10000"];

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface CompanyFormEditProps {
    companyData: Company;
    isNew: boolean;
    setOpen: (open: boolean) => void;
    onUpdate: (updatedCompany: Company, isNew: boolean) => void;
}

export const CompanyFormEdit: React.FC<CompanyFormEditProps> = ({
    companyData,
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
    const [trainers, setUsers] = useState<User[]>([]);
    const [modalInfomation, setModalInfomation] = useState<ModalInfomation>({
        modalType: "",
        title: "",
        modalBody: "",
        buttonText: "",
    });

    const [date, setDate] = React.useState<DateRange | undefined>();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),

        defaultValues: {
            companyName: companyData.companyName,
            companyEmail: companyData.companyEmail,
            numberOfDocuments: documentPlan.includes(
                companyData.numberOfDocuments.toString()
            )
                ? (companyData.numberOfDocuments.toString() as ProfileFormValues["numberOfDocuments"])
                : "1000",
            companyPlan: companyData.companyPlan,
        },
        mode: "onChange",
    });

    const baseURL =
        process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_PROD
            : process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_DEV;

    async function onSubmit(formData: ProfileFormValues) {
        try {
            // If formData was accidentally shaped like { data: {...} }, unwrap it.
            const payload: any = {
                ...((formData as any)?.data ?? formData),
                adminUpdate: true,
            };

            let response;
            if (isNew) {
                response = await axios.post(
                    `${baseURL}api/companies/create`,
                    payload
                );
            } else {
                // You can keep POST if your backend expects it; PUT/PATCH is more RESTful.
                response = await axios.patch(
                    `${baseURL}api/companies/${companyData.id}`,
                    payload
                );
            }

            handleClose();

            if (isNew) {
                toast({ description: `New company added succssfully` });
                onUpdate(response.data.company, true);
            } else {
                toast({ description: `Le parcours a été modifié avec succès` });
                onUpdate(response.data.company, false);
            }
        } catch (error) {
            console.error(error);
            toast({
                title: `Une erreur s'est produite lors de la création de la compagnie.`,
                description: `Veuillez réessayer ultérieurement.`,
            });
        }
    }

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8'>
                    <FormField
                        control={form.control}
                        name='companyName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Company Name....'
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
                        name='companyEmail'
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
                    <FormField
                        control={form.control}
                        name={`companyPlan`}
                        render={({ field, fieldState: { error } }) => (
                            <FormItem className=''>
                                <FormLabel>Plan</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Please select the plan' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {planType.map((type, index) => (
                                            <SelectItem
                                                key={index}
                                                value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {error && (
                                    <FormMessage>{error.message}</FormMessage>
                                )}
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`numberOfDocuments`}
                        render={({ field, fieldState: { error } }) => (
                            <FormItem className=''>
                                <FormLabel>Number of Document</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Please select the number of document' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {documentPlan.map((number, index) => (
                                            <SelectItem
                                                key={index}
                                                value={number}>
                                                {number}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {error && (
                                    <FormMessage>{error.message}</FormMessage>
                                )}
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
                                Creer
                            </Button>
                        ) : (
                            <Button type='submit' className='flex'>
                                Modifier
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
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
