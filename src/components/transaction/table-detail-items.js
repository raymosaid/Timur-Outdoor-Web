import { formatCurrency } from "@/lib/utils"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table"

export const TableDetailItems = ({
  listItems,
  transaction
}) => {
  const displayData = [
    {title: "", value: (listItems.reduce((acc, obj) => acc + obj.price_at_transaction * obj.quantity, 0))},
    {title: "Hari Sewa", value: `X ${transaction.hari_sewa}`},
    {title: "Sub Total", value: (listItems.reduce((acc, obj) => acc + obj.price_at_transaction * obj.quantity * transaction?.hari_sewa, 0))},
    {title: "Diskon", value: (transaction.discount)},
    {title: "Denda", value: (transaction.denda)},
    {title: "Total", value: (transaction.total_amount + transaction.denda)},
  ]
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Barang</TableHead>
          <TableHead>Harga</TableHead>
          <TableHead>Quantity</TableHead>
          {/* <TableHead>Hari Sewa</TableHead> */}
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!!listItems && listItems.map((item, index) => (
          <TableRow
            key={item.id}
            className="cursor-pointerr hover:bg-primary/20"
          >
            <TableCell>{index+1}</TableCell>
            <TableCell>{item.product?.name}</TableCell>
            <TableCell>{formatCurrency(item.price_at_transaction)}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            {/* <TableCell>{transaction.hari_sewa}</TableCell> */}
            <TableCell>
              <div className="flex justify-between items-center">
                <div>Rp</div>
                <div>{(item.price_at_transaction * item.quantity)}</div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {displayData.map((item, index) => (
          <TableRow key={index}>
            <TableCell colSpan={3} />
            <TableCell colSpan={1} className="text-left">{item.title}</TableCell>
            <TableCell className={item.title === "" ? "bg-gray-300" : ""}>
              <div className="flex justify-between">
                <div>{item.title === "Hari Sewa" ? "" : "Rp"}</div>
                <div>{item.value || "-"}</div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableFooter>
    </Table>
  )
}