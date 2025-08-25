import React, { use, useCallback, useEffect, useState } from "react";
import { format, set } from "date-fns";
import { UseFormReturn, useForm } from "react-hook-form";
import { ca, fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, MinusIcon } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ConditionItem } from "@/Types/types";

import { FieldErrors } from "react-hook-form";
import { formSchema, FormValues } from "./workflow-form";
import { MinusCircle } from "lucide-react";
import PDFLogo from "@/images/pdflogo.png";
import Image from "next/image";
import { WorkflowAutomation, IndexField, SelectListValue } from "@/Types/types";

type ConditionComponentProps = {
    value: ConditionItem;
    onChange: (values: FormValues) => void;
    error: FieldErrors<typeof formSchema> | undefined;
    form: UseFormReturn<WorkflowAutomation>;
    index: number;
    indexField: IndexField[];
    isLast: boolean;
    removeCondition: () => void;
};

const ConditionComponent: React.FC<ConditionComponentProps> = props => {
    const { onChange, error, form, index, indexField, isLast, ...otherProps } =
        props;
    const [selectedIndexfield, setSelectedTIndexField] =
        React.useState<IndexField>();
    const [operator, setOperator] = React.useState<any>();
    const [isSelectlist, setIsSelectList] = React.useState<Boolean>();
    const [disabledEntry, setDisabledEntry] = React.useState<Boolean>(false);

    const handleOperator = (value: string) => {
        if (value === "Is empty" || value === "Is not empty") {
            setDisabledEntry(true);
        } else {
            setDisabledEntry(false);
        }
    };
    const handleIndexSelection = (value: string) => {
        const selectedField = indexField.find(field => field.id === value);
        if (selectedField) {
            console.log(selectedField);

            if (selectedField.type === 7) {
                setIsSelectList(true);
            } else {
                setIsSelectList(false);
            }

            switch (selectedField.type) {
                case 1:
                case 2:
                case 4:
                case 7:
                case 9:
                    setOperator([
                        "=",
                        "!=",
                        "Contains",
                        "Does not contain",
                        "Starts with",
                        "Ends with",
                        "Is empty",
                        "Is not empty",
                    ]);
                    break;
                case 3:
                case 5:
                case 6:
                case 8:
                    setOperator([
                        "=",
                        "!=",
                        ">",
                        "<",
                        ">=",
                        "<=",
                        "Is empty",
                        "Is not empty",
                    ]);
                    break;

                default:
                    setOperator([
                        "=",
                        "!=",
                        ">",
                        "<",
                        ">=",
                        "<=",
                        "Is empty",
                        "Is not empty",
                    ]);
                    break;
            }
            setSelectedTIndexField(selectedField);
        }
    };
    const linkOperator = ["AND", "OR"];

    return (
        <>
            <div className='flex relative'>
                <div className='w-4/5'>
                    <div className='flex'>
                        {/* Category */}
                        <FormField
                            control={form.control}
                            name={
                                `conditionSet.${index}.parenthesisStart` as any
                            }
                            render={({ field, fieldState: { error } }) => (
                                <FormItem className='w-1/3 mr-2'>
                                    <FormLabel>Parenthesis Start</FormLabel>
                                    <Select
                                        onValueChange={value => {
                                            field.onChange(value);
                                        }}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Please choose a parenthesis' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value='None'>
                                                &nbsp;
                                            </SelectItem>
                                            <SelectItem value='('>(</SelectItem>
                                            <SelectItem value='(('>
                                                ((
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
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
                            name={`conditionSet.${index}.conditionField` as any}
                            render={({ field, fieldState: { error } }) => (
                                <FormItem className='w-1/3 mr-2'>
                                    <FormLabel>Index field</FormLabel>
                                    <Select
                                        onValueChange={value => {
                                            field.onChange(value);
                                            handleIndexSelection(value);
                                        }}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Veuillez choisir une catégorie' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {indexField.map(
                                                (field: IndexField) => (
                                                    <SelectItem
                                                        key={field.id}
                                                        value={field.id}>
                                                        {field.name}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {error && (
                                        <FormMessage>
                                            {error.message}
                                        </FormMessage>
                                    )}
                                </FormItem>
                            )}
                        />
                        {selectedIndexfield && (
                            <FormField
                                control={form.control}
                                name={
                                    `conditionSet.${index}.conditionOperator` as any
                                }
                                render={({ field, fieldState: { error } }) => (
                                    <FormItem className='w-1/3 mr-2'>
                                        <FormLabel>Operator</FormLabel>
                                        <Select
                                            onValueChange={value => {
                                                field.onChange(value);
                                                handleOperator(value);
                                            }}
                                            defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Please choose an operator' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {operator.map(
                                                    (
                                                        op: string,
                                                        index: number
                                                    ) => (
                                                        <SelectItem
                                                            key={index}
                                                            value={op}>
                                                            {op}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {error && (
                                            <FormMessage>
                                                {error.message}
                                            </FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />
                        )}
                        {selectedIndexfield && isSelectlist && (
                            <FormField
                                control={form.control}
                                name={
                                    `conditionSet.${index}.conditionValue` as any
                                }
                                render={({ field, fieldState: { error } }) => (
                                    <FormItem className='w-1/3 mr-2'>
                                        <FormLabel>Index field</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Choose or enter a value' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {selectedIndexfield.selectListValues?.map(
                                                    (
                                                        value: SelectListValue
                                                    ) => (
                                                        <SelectItem
                                                            key={value.Guid}
                                                            value={
                                                                value.FieldValue
                                                            }>
                                                            {value.FieldValue}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {error && (
                                            <FormMessage>
                                                {error.message}
                                            </FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />
                        )}
                        {selectedIndexfield &&
                            !isSelectlist &&
                            !disabledEntry && (
                                <FormField
                                    control={form.control}
                                    name={
                                        `conditionSet.${index}.conditionValue` as any
                                    }
                                    render={({
                                        field,
                                        fieldState: { error },
                                    }) => (
                                        <FormItem className='w-1/2 mr-2'>
                                            <FormLabel>Description</FormLabel>
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
                            )}
                        {selectedIndexfield && (
                            <FormField
                                control={form.control}
                                name={
                                    `conditionSet.${index}.parenthesisEnd` as any
                                }
                                render={({ field, fieldState: { error } }) => (
                                    <FormItem className='w-1/3 mr-2'>
                                        <FormLabel>Parenthesis Start</FormLabel>
                                        <Select
                                            onValueChange={value => {
                                                field.onChange(value);
                                            }}
                                            defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Please choose a parenthesis' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='None'>
                                                    &nbsp;
                                                </SelectItem>
                                                <SelectItem value=')'>
                                                    )
                                                </SelectItem>
                                                <SelectItem value='))'>
                                                    ))
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {error && (
                                            <FormMessage>
                                                {error.message}
                                            </FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />
                        )}
                        {selectedIndexfield && !isLast && (
                            <FormField
                                control={form.control}
                                name={
                                    `conditionSet.${index}.linkOperator` as any
                                }
                                render={({ field, fieldState: { error } }) => (
                                    <FormItem className='w-1/3 mr-2'>
                                        <FormLabel>Operator</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Please choose an operator' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {linkOperator.map(
                                                    (
                                                        op: string,
                                                        index: number
                                                    ) => (
                                                        <SelectItem
                                                            key={index}
                                                            value={op}>
                                                            {op}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {error && (
                                            <FormMessage>
                                                {error.message}
                                            </FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                </div>
                <Button
                    type='button'
                    variant={"ghost"}
                    onClick={props.removeCondition}
                    className='absolute top-[-1.5rem] right-0 text-gray-400 hover:text-red-500 bg-transparent hover:bg-transparent'>
                    <MinusCircle className='' />
                </Button>
            </div>
            <Separator className='mb-8 border-b-[1px]' />
        </>
    );
};

export default ConditionComponent;
