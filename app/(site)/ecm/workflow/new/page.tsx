"use client";

import { Separator } from "@/components/ui/separator";
//import { ExpensesFormUser } from "@/components/forms/expenses-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Workflow } from "@/Types/types";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { WorkflowForm } from "@/components/forms/workflow-form";
import { log } from "console";

const CreateWorkflowPage = () => {
    //const [state, setState] = useState(initialState);
    //const { data: session } = useSession();
    const data = "data";
    const [workflowData, setWorkflowData] = useState<Workflow[]>();
    const [isLoading, setIsLoading] = useState(true);
    const baseURL =
        process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_PROD
            : process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_DEV;

    useEffect(() => {
        setIsLoading(true);
        fetch(`${baseURL}api/workflows/get-company-ecm-workflows/`)
            .then(response => response.json())
            .then(data => {
                // Log the response to the console
                setWorkflowData(data.workflows);
                console.log(workflowData);

                setIsLoading(false);
            })
            .catch(error => console.error("Error:", error));
    }, [baseURL]);

    return (
        <Card className='bg-white p-10 rounded-2xl shadow-2xl'>
            <CardHeader>
                <div>
                    <CardTitle className='text-lg font-medium'>
                        Workflow automation
                    </CardTitle>
                    <CardDescription className='text-sm text-muted-foreground'>
                        Create your workflow automation
                    </CardDescription>
                </div>
            </CardHeader>
            <Separator className='mb-8' />
            <CardContent className='w-full p-0'>
                {data && (
                    <WorkflowForm
                        workflowData={workflowData || []}
                        //userId={session?.user?.id || ""}
                        userId='AAAAAA'
                        workflowLoading={isLoading}
                    />
                )}
            </CardContent>
        </Card>
    );
};
export default CreateWorkflowPage;
