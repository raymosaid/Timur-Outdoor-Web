import { addHours, format, isValid, parseISO } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export const TableItems = ({ listItemsTransactions, type }) => (
  <div className="h-[63vh] relative overflow-y-auto">
    <Table>
      <TableHeader className="sticky top-0 bg-secondary">
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Nama Item</TableHead>
          <TableHead>Penyewa</TableHead>
          <TableHead>Quantity</TableHead>
          {type === "sewa" && <TableHead>Tanggal Pengembalian</TableHead>}
          {type === "sewa" && <TableHead>Status</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {!!listItemsTransactions && listItemsTransactions.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{item?.product?.name}</TableCell>
            <TableCell>{item?.transaction?.name}</TableCell>
            <TableCell>{item?.quantity}</TableCell>
            {type === "sewa" && (
              <TableCell>
                {item?.transaction?.tanggal_pengembalian
                  ? isValid(parseISO(item.transaction?.tanggal_pengembalian))
                    ? format(parseISO(item.transaction?.tanggal_pengembalian), "eee, d MMM, HH:mm")
                    : "Invalid date"
                  : "Loading..."}
              </TableCell>
            )}
            {type === "sewa" && <TableCell className={(item?.transaction?.status === "Sewa" && addHours(item?.transaction?.tanggal_pengembalian, 5) < new Date()) && "text-red-500 font-medium"}>{item?.transaction?.status === "Sewa" ? "Berlangsung" : item?.transaction?.status}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)