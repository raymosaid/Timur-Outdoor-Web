import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"

export const TableDetailPayments = ({ data }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Jumlah</TableHead>
          <TableHead>Metode</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!!data && data.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{index+1}</TableCell>
            <TableCell>{format(item.created_at, "eee, d MMM, HH:mm")}</TableCell>
            <TableCell>{formatCurrency(item.amount)}</TableCell>
            <TableCell>{item.method}</TableCell>
            <TableCell>{item.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}