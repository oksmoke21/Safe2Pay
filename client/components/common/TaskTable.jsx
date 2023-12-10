"use client";

import React, { useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// export const data = [
//     {
//       id: "1",
//       title: "Payment 1",
//       date: "2023-01-01",
//       payment: 500,
//       stakedAmount: 1000,
//     },
//     {
//       id: "2",
//       title: "Payment 2",
//       date: "2023-02-01",
//       payment: 700,
//       stakedAmount: 1200,
//     },
//     {
//         id: "1",
//         title: "Payment 1",
//         date: "2023-01-01",
//         payment: 500,
//         stakedAmount: 1000,
//       },
//       {
//         id: "2",
//         title: "Payment 2",
//         date: "2023-02-01",
//         payment: 700,
//         stakedAmount: 1200,
//       },
//       {
//         id: "3",
//         title: "Payment 1",
//         date: "2023-01-01",
//         payment: 500,
//         stakedAmount: 1000,
//       },
//       {
//         id: "4",
//         title: "Payment 2",
//         date: "2023-02-01",
//         payment: 700,
//         stakedAmount: 1200,
//       },
//   ];

export const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <div>{row.getValue("date")}</div>,
    },
    {
      accessorKey: "payment",
      header: "Payment",
      cell: ({ row }) => <div>{row.getValue("payment")}</div>,
    },
  ];
  
  const completedHandler = () => {
    // Update the active row index
    setActiveRowIndex((prevIndex) => prevIndex + 1);
  };const reportHandler = ()=>{}
export function TaskTable({data}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const completedHandler = () => {
    // Update the active row index
    setActiveRowIndex((prevIndex) => prevIndex + 1);

    // Add any additional logic here based on the completed action
    // For example, you may want to send an API request, update a database, etc.
  };
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : ""}
                  className={`${
                    index === activeRowIndex ? "bg-green-200" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {/* Add a button in the last cell for the "Mark as Active" action */}
                  <TableCell>
                    <Button
                      onClick={completedHandler}
                      disabled={index !== activeRowIndex}
                      className={`${
                        index === activeRowIndex ? "bg-green-500" : "bg-gray-300"
                      } text-white`}
                    >
                      Mark as Active
                    </Button>
                  </TableCell>
                  {/* Add buttons for the "Mark as Completed" and "Report" actions */}
                  <TableCell>
                    <Button
                      onClick={reportHandler}
                      disabled={index !== activeRowIndex}
                      className={`${
                        index === activeRowIndex ? "bg-red-500" : "bg-gray-300"
                      } text-white`}
                    >
                      Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
