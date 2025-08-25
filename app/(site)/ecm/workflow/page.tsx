"use client";
import DataTable from "@/components/DataTable";
import * as React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
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
import { User, WorkflowAutomation } from "@/Types/types";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner";
import { set } from "date-fns";
import axios from "axios";

const UserPage = () => {
    const [data, setData] = useState<WorkflowAutomation[]>([]);
    const [selected, setSelected] = useState<WorkflowAutomation>();
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const baseURL =
        process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_PROD
            : process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_DEV;
    useEffect(() => {
        fetch(`${baseURL}api/workflows/`)
            .then(response => response.json())
            .then(data => {
                // Log the response to the console
                setData(data.workflows);
                setIsLoading(false);
            })
            .catch(error => console.error("Error:", error));
    }, []);

    const handleUpdate = (
        updatedWorkflow: WorkflowAutomation,
        isNew: boolean
    ) => {
        if (isNew) {
            setData([...data, updatedWorkflow]);
        } else {
            const updatedData = data.map(user =>
                user.id === updatedWorkflow.id ? updatedWorkflow : user
            );
            setData(updatedData);
        }
    };

    const handleResetPassword = async (userId: string) => {
        try {
            const response = await axios.post(
                `${baseURL}api/user/reset-password/${userId}`
            );
            toast({
                description: `Le mot de passe a été réinitialisé avec succès`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const columns: ColumnDef<WorkflowAutomation>[] = [
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
                    }
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
            id: "name",
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className='capitalize'>{row.getValue("name")}</div>
            ),
        },
        {
            id: "cabinetName",
            accessorKey: "cabinetName",
            header: "File Cabinet",
            cell: ({ row }) => (
                <div className='capitalize'>{row.getValue("cabinetName")}</div>
            ),
        },
        {
            id: "interval",
            accessorKey: "interval",
            header: "Interval",
            cell: ({ row }) => (
                <div className='capitalize'>{row.getValue("interval")}</div>
            ),
        },
        // {
        //     id: "taskName",
        //     accessorKey: "taskName",
        //     header: "Task",
        //     cell: ({ row }) => {
        //         const taskData = row.original.taskData;
        //         return <div className='capitalize'>{taskData.name}</div>;
        //     },
        // },

        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original;
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
                                <DropdownMenuItem
                                    onClick={() => {
                                        setOpen(true);
                                        setSelected(user);
                                    }}>
                                    Modifier
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem>
                                    <Link href={`/users/${user.id}`}>
                                        Voir les notes de frais
                                    </Link>
                                </DropdownMenuItem> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        handleResetPassword(user.id);
                                    }}></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    const actionButton = (
        <Button variant='outline' className='h-8 mr-2' asChild>
            <Link href='/ecm/workflow/new'>
                <PlusIcon className='mr-2 h-4 w-4' /> New Automation
            </Link>
        </Button>
    );

    const filter1 = data
        ? data
              .flatMap(item => item.name)
              .map(user => ({
                  label: user,
                  value: user,
              }))
              .reduce((unique, o) => {
                  if (
                      !unique.some(
                          (obj: { label: string; value: string }) =>
                              obj.label === o.label && obj.value === o.value
                      )
                  ) {
                      unique.push(o);
                  }
                  return unique;
              }, [] as { label: string; value: string }[])
        : [];

    return (
        <Card className='bg-white p-10 rounded-2xl shadow-2xl'>
            <CardHeader>
                <div>
                    <CardTitle className='text-lg font-medium'>
                        Workflow Manager
                    </CardTitle>
                    <CardDescription className='text-sm text-muted-foreground'>
                        Automate your workflow
                    </CardDescription>
                </div>
            </CardHeader>
            <Separator className='mb-8' />
            <CardContent className='space-y-6'>
                {isLoading ? (
                    <Spinner className='flex justify-center' /> // Render the spinner if isLoading is true
                ) : (
                    <DataTable
                        data={data}
                        columns={columns}
                        filter1={filter1}
                        enableColumnFilters={true}
                        inputFilterColumn='fullName'
                        filter1Title='Formateurs'
                        filter1Column='user'
                        actionButton={actionButton}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default UserPage;
