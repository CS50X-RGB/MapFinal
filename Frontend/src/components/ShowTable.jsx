import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Chip,
  Switch,
  useDisclosure,
  Button,
} from "@nextui-org/react";

// interface CustomTableProps {
//     columnHeaders: {
//         name: string,
//     }[];
//     page: number;
//     pages: number;
//     setPage: Dispatch<SetStateAction<number>>;
//     loadingState?: any;
//     data: any[];
// }

export default function ShowTableData({
  columnHeaders,
  page,
  pages,
  setPage,
  loadingState,
  data,
}) {
  const roleColors = {
    ADMIN: "primary",
    BIDDER: "warning",
    SELLER: "secondary",
  };
  const {
    isOpen: isOpenStatus,
    onOpen: onOpenStatus,
    onOpenChange: onOpenChangeStatus,
    onClose: onCloseStatus,
  } = useDisclosure();
  const [item, setItem] = useState({});
  const clickChip = (item) => {
    onOpenStatus();
    setItem(item);
    console.log(item, "Item");
  };
  const getValue = (item, columnKey) => {
    console.log(columnKey, "Column");
    switch (columnKey) {
      case "role":
        return (
          <Chip color={roleColors[item.role.name] || "default"}>
            {item.role.name}
          </Chip>
        );
      default:
        return (
          <p className="text-sm font-bold">{item[columnKey.toLowerCase()]}</p>
        );
    }
  };

  return (
    <>
      <Table
        removeWrapper
        aria-label="Example table with client async pagination"
        className="font-mono bg-text p-4"
        bottomContent={
          <div className="flex bg-back w-full justify-center">
            <Pagination
              isCompact
              className="text-text"
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader columns={columnHeaders}>
          {(column) => (
            <TableColumn className="bg-black text-text" key={column.name}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          className="bg-text"
          items={data ?? []}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(item) => (
            <TableRow
              className="bg-back text-text"
              key={item?._id || Math.random().toString()}
            >
              {(columnKey) => (
                <TableCell>{getValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
