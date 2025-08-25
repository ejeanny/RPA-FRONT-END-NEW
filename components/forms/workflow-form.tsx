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
import { de } from "date-fns/locale";
import { set } from "date-fns";
import { Input } from "@/components/ui/input";

export const formSchema = z.object({
    id: z.string(),
    name: z.string(),
    interval: z.string(),
    decisionData: z.object({
        id: z.string(),
        name: z.string(),
    }),
    taskData: z.object({
        id: z.string(),
        name: z.string(),
    }),
    workflowData: z.object({
        id: z.string(),
        name: z.string(),
        cabinetId: z.string(),
        cabinetName: z.string(),
        publishedId: z.string(),
    }),
    conditionSet: z
        .array(
            z.object({
                conditionField: z.string(),
                conditionOperator: z.string(),
                conditionValue: z.string(),
                linkOperator: z.string(),
                parenthesisStart: z.string(),
                parenthesisEnd: z.string(),
            })
        )
        .optional(),
});

export type FormValues = z.infer<typeof formSchema>;

interface ConditionsFormProps {
    workflowData: Workflow[];
    userId: string;
    workflowLoading: boolean;
}

export const WorkflowForm: React.FC<ConditionsFormProps> = ({
    workflowData,
    userId,
    workflowLoading,
}) => {
    const [showModal, setShowModal] = useState(workflowLoading);
    const [modalInfomation, setModalInfomation] = useState<ModalInfomation>({
        modalType: "",
        title: "",
        modalBody: "",
        buttonText: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isTaskLoading, setTaskLoading] = useState(false);
    const [isDecisionLoading, setDecisionIsLoading] = useState(false);
    const [indexfinishedLoading, setIndexFinishedLoading] =
        React.useState<Boolean>(false);

    const [conditionSet, setConditions] = useState<ConditionItem[]>([]);

    const [selectedWorkflow, setSelectedWorkflow] = React.useState<WfData>();
    const [selectedTask, setSelectedTask] = React.useState<TaskData>();
    const [selectedDecision, setSelectedDecision] =
        React.useState<DecisionData>();

    const [taskData, setTaskData] = React.useState<any>();
    const [indexData, setIndexData] = React.useState<any>();
    const [decisionData, setDecisionData] = React.useState<any>();

    const [step, setStep] = React.useState(1);

    const form = useForm<WorkflowAutomation>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            name: "",
            interval: "",
            decisionData: {
                id: "",
                name: "",
            },
            taskData: {
                id: "",
                name: "",
            },
            workflowData: {
                id: "",
                name: "",
                cabinetId: "",
                cabinetName: "",
                publishedId: "",
            },
            conditionSet: [],
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "conditionSet", // This should match the name of the field in your form values
    });
    const addCondition = () => {
        append({
            conditionField: "",
            conditionOperator: "=",
            conditionValue: "",
            linkOperator: "",
            parenthesisStart: "",
            parenthesisEnd: "",
        } as ConditionItem);
    };

    const removeCondition = (index: number) => {
        remove(index);
    };
    const {
        register,
        handleSubmit,
        setValue,

        formState: { errors },
    } = form;

    const { watch } = form;
    const intervalValue = watch("interval");

    useEffect(() => {
        if (selectedWorkflow) {
            setTaskLoading(true);
            fetch(
                `${baseURL}api/workflows/get-ecm-workflow-task?publishedId=${selectedWorkflow.publishedId}&cabinetId=${selectedWorkflow.cabinetId}`
            )
                .then(response => response.json())
                .then(data => {
                    // Log the response to the console
                    setTaskData(data.tasks);
                    console.log(workflowData);

                    setIsLoading(false);
                })
                .catch(error => console.error("Error:", error));
        }
    }, [selectedWorkflow]);
    useEffect(() => {
        if (selectedTask && selectedWorkflow) {
            // setDecisionLoading(true);
            fetch(
                `${baseURL}api/workflows/get-ecm-task-decision?taskId=${selectedTask.id}&cabinetId=${selectedWorkflow.cabinetId}`
            )
                .then(response => response.json())
                .then(data => {
                    // Log the response to the console
                    setDecisionData(data.decisions);
                    console.log(workflowData);

                    setIsLoading(false);
                })
                .catch(error => console.error("Error:", error));
        }
    }, [selectedTask, selectedWorkflow]);
    useEffect(() => {
        if (selectedTask && selectedWorkflow && selectedDecision) {
            // setDecisionLoading(true);
            fetch(
                `${baseURL}api/workflows/get-ecm-cabinet-indexfield?cabinetId=${selectedWorkflow.cabinetId}`
            )
                .then(response => response.json())
                .then(data => {
                    // Log the response to the console
                    setIndexData(data.indexfields);
                    setIndexFinishedLoading(true);
                    console.log(workflowData);

                    setIsLoading(false);
                })
                .catch(error => console.error("Error:", error));
        }
    }, [selectedTask, selectedWorkflow, selectedDecision]);

    const handleConditionChange = (index: number, value: ConditionItem) => {
        setValue(`conditionSet.${index}`, value);

        const newConditions = [...conditionSet];
        newConditions[index] = value;
        setConditions(newConditions || []);
    };

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
                    userId,
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
            {workflowLoading ? (
                <Spinner className='flex justify-center' /> // Render the spinner if isLoading is true
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='space-y-8'>
                        {/* Trainer */}
                        {step === 1 && (
                            <>
                                {/* Trainer */}
                                <div className='flex justify-between'>
                                    <FormField
                                        control={form.control}
                                        name='workflowData'
                                        render={({ field }) => (
                                            <FormItem className='w-1/2 mr-2'>
                                                <FormLabel className='mr-4'>
                                                    Workflow
                                                </FormLabel>
                                                <PresetSelector
                                                    presets={workflowData}
                                                    selectedPreset={
                                                        selectedWorkflow
                                                    }
                                                    setSelectedPreset={selected => {
                                                        setSelectedWorkflow(
                                                            selected
                                                        );
                                                        form.setValue(
                                                            "workflowData",
                                                            selected
                                                        );
                                                    }}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {selectedWorkflow && taskData && (
                                    <div className='flex justify-between'>
                                        <FormField
                                            control={form.control}
                                            name='taskData'
                                            render={({ field }) => (
                                                <FormItem className='w-1/2 mr-2'>
                                                    <FormLabel className='mr-4'>
                                                        Task
                                                    </FormLabel>
                                                    <PresetSelector
                                                        presets={taskData}
                                                        selectedPreset={
                                                            selectedTask
                                                        }
                                                        setSelectedPreset={selected => {
                                                            setSelectedTask(
                                                                selected
                                                            );
                                                            form.setValue(
                                                                "taskData",
                                                                selected
                                                            );
                                                        }}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                                {selectedTask && decisionData && (
                                    <div className='flex justify-between'>
                                        <FormField
                                            control={form.control}
                                            name='decisionData'
                                            render={({ field }) => (
                                                <FormItem className='w-1/2 mr-2'>
                                                    <FormLabel className='mr-4'>
                                                        Decision
                                                    </FormLabel>
                                                    <PresetSelector
                                                        presets={decisionData}
                                                        selectedPreset={
                                                            selectedDecision
                                                        }
                                                        setSelectedPreset={selected => {
                                                            setSelectedDecision(
                                                                selected
                                                            );
                                                            form.setValue(
                                                                "decisionData",
                                                                selected
                                                            );
                                                        }}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                                {selectedDecision && (
                                    <div className='flex justify-between'>
                                        <FormField
                                            control={form.control}
                                            name={`interval` as any}
                                            render={({
                                                field,
                                                fieldState: { error },
                                            }) => (
                                                <FormItem className='w-1/2 mr-2'>
                                                    <FormLabel>
                                                        Interval
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='Value...'
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
                                    </div>
                                )}
                                <div className='flex w-full justify-end'>
                                    <Link
                                        className={`${buttonVariants({
                                            variant: "outline",
                                        })} mr-2`}
                                        href='/my-workflow.conditionSet'>
                                        Cancel
                                    </Link>

                                    <Button
                                        type='button'
                                        onClick={() => setStep(2)}
                                        disabled={
                                            !indexfinishedLoading ||
                                            !intervalValue
                                        }>
                                        Next
                                    </Button>
                                </div>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <div className='flex justify-end mb-8'>
                                    <Button
                                        type='button'
                                        onClick={addCondition}>
                                        <PlusIcon className='mr-2 h-4 w-4' />
                                        Add a condition
                                    </Button>
                                </div>
                                <Separator className='mb-8' />

                                {form
                                    .getValues()
                                    .conditionSet?.map(
                                        (condition, index, array) => (
                                            <ConditionComponent
                                                form={form}
                                                key={index}
                                                index={index}
                                                indexField={indexData}
                                                value={condition}
                                                isLast={
                                                    index === array.length - 1
                                                }
                                                removeCondition={() =>
                                                    removeCondition(index)
                                                }
                                            />
                                        )
                                    )}
                                {/* End of Form */}
                                <div className='flex w-full justify-end'>
                                    <Link
                                        className={`${buttonVariants({
                                            variant: "destructive",
                                        })} mr-2`}
                                        href='/my-workflow.conditionSet'>
                                        Cancel
                                    </Link>
                                    <Button
                                        type='button'
                                        onClick={() => setStep(1)}
                                        className='mx-2'
                                        variant={"outline"}
                                        disabled={!indexfinishedLoading}>
                                        Back
                                    </Button>
                                    {isLoading ? (
                                        <Button
                                            type='submit'
                                            className='flex'
                                            disabled>
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
                                            Create
                                        </Button>
                                        // <Button
                                        //     type='button' // Change this to 'button' to prevent automatic form submission
                                        //     className='flex'
                                        //     onClick={() => {
                                        //         // Log the form data
                                        //         console.log(form.getValues());
                                        //     }}>
                                        //     Create
                                        // </Button>
                                    )}
                                </div>
                            </>
                        )}
                    </form>
                </Form>
            )}
            <Modal
                modalType={modalInfomation.modalType}
                open={showModal}
                setOpen={setShowModal}
                href='/ecm/workflow'
                modalTitle={modalInfomation.title}
                modalBody={modalInfomation.modalBody}
                buttonText={modalInfomation.buttonText}
            />
        </>
    );
};
