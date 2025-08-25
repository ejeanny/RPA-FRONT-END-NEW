"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { PopoverProps } from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/new-york/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface PresetSelectorProps extends PopoverProps {
    presets: any[];
    selectedPreset?: any;
    label?: string;
    setSelectedPreset: (preset: any) => void;
}

export function PresetSelector({
    presets,
    selectedPreset,
    setSelectedPreset,
    label,
    ...props
}: PresetSelectorProps) {
    const [open, setOpen] = React.useState(false);

    const router = useRouter();

    return (
        <Popover open={open} onOpenChange={setOpen} {...props}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-label={label || "Select a workflow..."}
                    aria-expanded={open}
                    className='flex-1 justify-between md:max-w-[200px] lg:max-w-[300px] lg:min-w-[200px]'>
                    {selectedPreset
                        ? selectedPreset.name
                        : label || "Select a workflow..."}
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[300px] p-0'>
                <Command>
                    <CommandInput placeholder='Chercher une formation' />
                    <CommandEmpty>No Published Workflow found</CommandEmpty>
                    <CommandGroup heading='' className='px-4 mt-2'>
                        {presets.map(preset => (
                            <CommandItem
                                key={preset.id}
                                onSelect={() => {
                                    setSelectedPreset(preset);
                                    setOpen(false);
                                }}>
                                {preset.name}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        selectedPreset?.id === preset.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
