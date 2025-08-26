"use client";
import DataTable from "@/components/DataTable";
import SideBar from "@/components/SideBar";
import * as React from "react";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { User, Company } from "@/Types/types";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import SidePanel from "@/components/ui/SidePanel";
import { CompanyFormEdit } from "@/components/forms/company-form";
import axios from "axios";
const CompanyPage = () => {
    const [data, setData] = useState<Company[]>([]);
    const [selected, setSelected] = useState<Company>();
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const domain = typeof window !== "undefined" ? window.location.origin : "";
    const [open, setOpen] = useState(false);
    const baseURL =
        process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_PROD
            : process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_DEV;
    useEffect(() => {
        axios
            .get(`${baseURL}api/companies/`)
            .then(response => {
                setData(response.data.companies);
                setIsLoading(false);
            })
            .catch(error => console.error("Error:", error));
    }, [baseURL]);

    const handleUpdate = (updatedCompany: Company, isNew: boolean) => {
        if (isNew) {
            setData([...data, updatedCompany]);
        } else {
            const updatedData = data.map(course =>
                course.id === updatedCompany.id ? updatedCompany : course
            );
            setData(updatedData);
        }
    };
    // const handleDeleteCompany = async (deletedCompany: Company) => {
    //     try {
    //         const response = await axios.delete(
    //             `${baseURL}api/course/${deletedCompany.id}`
    //         );
    //         // Handle successful deletion (e.g., update state or redirect)
    //         const updatedData = data.filter(
    //             course => course.id !== deletedCompany.id
    //         );
    //         setData(updatedData);
    //         toast({
    //             title: "Parcour supprimé",
    //             description: "Le parcours a été supprimé avec succès.",
    //         });
    //     } catch (error) {
    //         toast({
    //             title: "An error occurred.",
    //             description: "Unable to delete the course.",
    //             duration: 5000,
    //         });
    //     }
    // };
    const columns: ColumnDef<Company>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={value =>
                        table.toggleAllPageRowsSelected(!!value)
                    } //remove trace from git
                    aria-label='Select all'
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={value => row.toggleSelected(!!value)}
                    aria-label='Select row'
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "companyName",
            accessorKey: "companyName",
            header: "Company Name",
            cell: ({ row }) => (
                <div className='capitalize'>{row.getValue("companyName")}</div>
            ),
        },
        {
            id: "companyToken",
            accessorKey: "companyToken",
            header: "Company Token",
            cell: ({ row }) => (
                <div className=''>{row.getValue("companyToken")}</div>
            ),
        },

        {
            id: "companyEmail",
            accessorKey: "companyEmail",
            header: "Contact Email",
            cell: ({ row }) => (
                <div className=''>{row.getValue("companyEmail")}</div>
            ),
        },
        {
            id: "numberOfDocuments",
            accessorKey: "numberOfDocuments",
            header: "Number of Documents",
            cell: ({ row }) => (
                <div className='capitalize'>
                    {row.getValue("numberOfDocuments")}
                </div>
            ),
        },
        {
            id: "companyPlan",
            accessorKey: "companyPlan",
            header: "Plan",
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
            cell: ({ row }) => (
                <div className=''>
                    <Badge variant='secondary'>
                        {row.getValue("companyPlan")}
                    </Badge>
                </div>
            ),
        },
        {
            id: "numberOfDocumentsLeftCurrentPeriod",
            accessorKey: "numberOfDocumentsLeftCurrentPeriod",
            header: "Number of Documents Left for the Current Period",
            cell: ({ row }) => (
                <div className='capitalize'>
                    {row.getValue("numberOfDocumentsLeftCurrentPeriod")}
                </div>
            ),
        },
        {
            id: "numberOfDocumentsUsedCurrentPeriod",
            accessorKey: "numberOfDocumentsUsedCurrentPeriod",
            header: "Number of Documents Used for the Current Period",
            cell: ({ row }) => (
                <div className='capitalize'>
                    {row.getValue("numberOfDocumentsUsedCurrentPeriod")}
                </div>
            ),
        },
        {
            id: "companyStatus",
            accessorKey: "companyStatus",
            header: "Status",
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
            cell: ({ row }) => (
                <div className=''>
                    <Badge variant='secondary'>
                        {row.getValue("companyStatus")}
                    </Badge>
                </div>
            ),
        },

        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const course = row.original;

                return (
                    <div className='flex justify-end'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='ghost' className='h-8 w-8 p-0'>
                                    <span className='sr-only'>Open menu</span>
                                    <DotsHorizontalIcon className='h-4 w-4' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        setOpen(true);
                                        setSelected(course);
                                    }}>
                                    Edit
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem disabled></DropdownMenuItem>
                                <DropdownMenuSeparator /> */}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    const actionButton = (
        <Button
            variant='outline'
            onClick={() => {
                setOpen(true);
                setSelected({
                    companyName: "",
                    companyEmail: "",
                    numberOfDocuments: "1000",
                    companyPlan: "Monthly",
                } as Company);
            }}
            className='h-8 mr-2'>
            <PlusIcon className='mr-2 h-4 w-4' /> Add
        </Button>
    );

    const filter1 = [
        { value: "Monthly", label: "Monthly" },
        { value: "Yearly", label: "Yearly" },
    ];
    const filter2 = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
    ];

    return (
        <Card>
            {/* <CardHeader>
                <div>
                    <CardTitle className='text-lg font-medium'>
                        Gestion des Parcours
                    </CardTitle>
                    <CardDescription className='text-sm text-muted-foreground'>
                        Création, modification et gestion des formateurs
                    </CardDescription>
                </div>
            </CardHeader> */}
            <Separator className='mb-8' />
            <CardContent className='space-y-6'>
                {isLoading ? (
                    <Spinner className='flex justify-center' /> // Render the spinner if isLoading is true
                ) : (
                    <DataTable
                        data={data}
                        columns={columns}
                        enableColumnFilters={true}
                        inputFilterColumn='companyName'
                        filter1={filter1}
                        filter2={filter2}
                        filter1Title='Plan'
                        filter1Column='companyPlan'
                        filter2Title='Status'
                        filter2Column='companyStatus'
                        actionButton={actionButton}
                    />
                )}
            </CardContent>

            <SidePanel open={open} setOpen={setOpen}>
                <div className='flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl'>
                    <div className='h-0 flex-1 overflow-y-auto p-5'>
                        {selected && (
                            <CompanyFormEdit
                                isNew={!selected.id}
                                companyData={selected}
                                setOpen={setOpen}
                                onUpdate={handleUpdate}
                            />
                        )}
                    </div>
                </div>
            </SidePanel>
        </Card>
    );
};

export default CompanyPage;
