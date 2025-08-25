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
import { User, WorkflowAutomation, Company } from "@/Types/types";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner";
import { set } from "date-fns";
import axios from "axios";
import { ConnectionForm } from "@/components/forms/ecmConnection-form";

const companyID = "648c12c670cff823d02e32a9";

const UserPage = () => {
    const [data, setData] = useState<WorkflowAutomation[]>([]);
    const [selected, setSelected] = useState<WorkflowAutomation>();
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [company, setCompany] = useState<Company>();
    const baseURL =
        process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_PROD
            : process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_DEV;

    useEffect(() => {
        fetch(`${baseURL}api/companies/${companyID}`)
            .then(response => response.json())
            .then(data => {
                // Log the response to the console
                setData(data.workflows);
                setIsLoading(false);
            })
            .catch(error => console.error("Error:", error));
    }, []);

    return (
        <Card className='bg-white p-10 rounded-2xl shadow-2xl'>
            <CardHeader>
                <div>
                    <CardTitle className='text-lg font-medium'>
                        Dokmee ECM connection Manager
                    </CardTitle>
                    <CardDescription className='text-sm text-muted-foreground'>
                        Used to automate your workflow
                    </CardDescription>
                </div>
            </CardHeader>
            <Separator className='mb-8' />
            <CardContent className='space-y-6'>
                {isLoading ? (
                    <Spinner className='flex justify-center' /> // Render the spinner if isLoading is true
                ) : (
                    <ConnectionForm
                        ecmBaseURL={company?.ecmBaseURL || ""}
                        publickey={company?.publickey || ""}
                        userName={company?.userName || ""}
                        password={company?.password || ""}
                        apiKey={company?.apiKey || ""}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default UserPage;
