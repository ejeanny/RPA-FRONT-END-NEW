"use client";

// import { CalendarDateRangePicker } from "@/components/date-range-picker";
// import { MainNav } from "@/components/main-nav";
import OverviewTab from "@/components/dashboard/OverviewTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";

export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseURL =
        process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_PROD
            : process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_DEV;
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        console.log("fetching data");

        try {
            // Fetch the session to get the token
            const session = await getSession();
            if (!session || !session.accessToken) {
                throw new Error("No session or access token found");
            }
            // Make the request with the token in the headers
            const response = await axios.get(`${baseURL}api/dashboard/`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });
            setData(response.data);
        } catch (err) {
            setError(err as any);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Card>
            <div className='hidden flex-col md:flex'>
                <div className='flex-1 space-y-4 p-8 pt-6'>
                    <Tabs defaultValue='overview'>
                        <TabsList className=''>
                            <TabsTrigger value='overview'>Overview</TabsTrigger>
                            <TabsTrigger value='analytics' disabled>
                                Analytics
                            </TabsTrigger>
                            <TabsTrigger value='reports' disabled>
                                Reports
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value='overview' className='space-y-4'>
                            <OverviewTab />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </Card>
    );
}
