"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/registry/new-york/ui/table";

import { DataTablePagination } from "@/components/Data-Table/data-table-pagination";
import { DataTableToolbar } from "@/components/Data-Table/data-table-toolbar";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filter1?: any[];
    filter1Title?: string;
    filter2?: any[];
    filter2Title?: string;
    inputFilterColumn?: string;
    enableColumnFilters: boolean;
    filter1Column?: string;
    filter2Column?: string;
    actionButton?: React.ReactNode;
    inputPlaceHolder?: string;
    setFilteredData?: (filteredData: TData[]) => void;
    isLoading?: boolean;
}

const DataTable: React.FC<DataTableProps<any, any>> = ({
    columns,
    data,
    filter1,
    filter1Title,
    filter2,
    filter2Title,
    inputFilterColumn,
    enableColumnFilters,
    filter1Column,
    filter2Column,
    actionButton,
    inputPlaceHolder,
    setFilteredData,
    isLoading,
}) => {
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [prevFilteredData, setPrevFilteredData] = useState<any[]>([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });
    const filteredData = table.getRowModel().rows.map(row => row.original);

    useEffect(() => {
        if (
            setFilteredData &&
            JSON.stringify(filteredData) !== JSON.stringify(prevFilteredData)
        ) {
            setFilteredData(filteredData);
            setPrevFilteredData(filteredData);
        }
    }, [table, setFilteredData, prevFilteredData, filteredData]);
    return (
        <div className='space-y-4'>
            <DataTableToolbar
                table={table}
                filter1={filter1}
                filter1Title={filter1Title}
                filter2={filter2}
                filter2Title={filter2Title}
                inputFilterColumn={inputFilterColumn}
                enableColumnFilters={enableColumnFilters}
                filter1Column={filter1Column}
                filter2Column={filter2Column}
                actionButton={actionButton}
                inputPlaceHolder={inputPlaceHolder}
            />
            <div className='rounded-md border relative'>
                {isLoading && (
                    <div className='absolute inset-0  bg-opacity-50 flex items-center justify-center'>
                        <Spinner />
                    </div>
                )}
                <Table className={isLoading ? "filter blur-sm" : ""}>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        <>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }>
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className='h-24 text-center'>
                                        Aucun résultat.
                                    </TableCell>
                                </TableRow>
                            )}
                        </>
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
};

export default DataTable;
