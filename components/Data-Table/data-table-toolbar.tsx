"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    filter1?: any[];
    filter1Title?: string;
    filter1Column?: string;
    filter2Column?: string;
    filter2?: any[];
    filter2Title?: string;
    inputFilterColumn?: string;
    enableColumnFilters: boolean;
    actionButton?: React.ReactNode;
    inputPlaceHolder?: string;
}

export function DataTableToolbar<TData>({
    table,
    filter1,
    filter2,
    filter1Title,
    filter2Title,
    inputFilterColumn,
    enableColumnFilters,
    filter1Column,
    filter2Column,
    actionButton,
    inputPlaceHolder,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className='flex items-center justify-between'>
            {enableColumnFilters && (
                <div className='flex flex-1 items-center space-x-2'>
                    <Input
                        placeholder={inputPlaceHolder || "Filtrer..."}
                        value={
                            (table
                                .getColumn(inputFilterColumn || "id")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={event =>
                            table
                                .getColumn(inputFilterColumn || "id")
                                ?.setFilterValue(event.target.value)
                        }
                        className='h-8 w-[150px] lg:w-[250px]'
                    />

                    {enableColumnFilters && (
                        <>
                            {filter1Column &&
                                table.getColumn(filter1Column) && (
                                    <DataTableFacetedFilter
                                        column={table.getColumn(filter1Column)}
                                        title={filter1Title}
                                        options={filter1 || []}
                                    />
                                )}
                            {filter2Column &&
                                table.getColumn(filter2Column) && (
                                    <DataTableFacetedFilter
                                        column={table.getColumn(filter2Column)}
                                        title={filter2Title}
                                        options={filter2 || []}
                                    />
                                )}
                        </>
                    )}
                    {isFiltered && (
                        <Button
                            variant='ghost'
                            onClick={() => table.resetColumnFilters()}
                            className='h-8 px-2 lg:px-3'>
                            Réinitialiser
                            <Cross2Icon className='ml-2 h-4 w-4' />
                        </Button>
                    )}
                </div>
            )}
            {actionButton}
            <DataTableViewOptions table={table} />
        </div>
    );
}
