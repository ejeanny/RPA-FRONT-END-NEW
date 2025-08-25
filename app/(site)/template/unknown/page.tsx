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
import { User, Company, Profile } from "@/Types/types";
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
import { PresetSelector } from "@/components/ui/preset-selector";

const TemplatePage = () => {
    const [data, setData] = useState<Company[]>([]);
    const [selected, setSelected] = useState<Company>();
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<Profile[]>([]);
    const [selectedPreset, setSelectedPreset] = React.useState<any>();
    const { toast } = useToast();
    const domain = typeof window !== "undefined" ? window.location.origin : "";
    const [open, setOpen] = useState(false);
    const baseURL =
        process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_PROD
            : process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_DEV;
    useEffect(() => {
        axios
            .get(`${baseURL}api/template/get-profiles`)
            .then(response => {
                setProfile(response.data.profiles);
                setIsLoading(false);
            })
            .catch(error => console.error("Error:", error));
    }, [baseURL]);

    return (
        <Card>
            <CardHeader>
                {isLoading ? (
                    <Spinner className='flex justify-center' /> // Render the spinner if isLoading is true
                ) : (
                    <div className='flex items-center'>
                        <CardTitle className='text-lg font-medium'>
                            Select the Profile
                        </CardTitle>
                        <div className='ml-4'>
                            <PresetSelector
                                presets={profile}
                                selectedPreset={selectedPreset}
                                setSelectedPreset={setSelectedPreset}
                            />
                        </div>
                        <CardDescription className='text-sm text-muted-foreground'></CardDescription>
                    </div>
                )}
            </CardHeader>
            {selectedPreset && (
                <>
                    <Separator className='mb-8' />
                    <CardContent className='space-y-6'></CardContent>
                </>
            )}

            {/* <SidePanel open={open} setOpen={setOpen}>
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
            </SidePanel> */}
        </Card>
    );
};

export default TemplatePage;
