import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

export const TableProductAnalysis = ({ data, isLoading }) => {
  const [dataTable, setDataTable] = useState(data)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* <TableHead>No.</TableHead> */}
          <TableHead>Product</TableHead>
          <TableHead>Total Sewa</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!isLoading && data.slice(0, 5).map((item, index) => (
          <TableRow key={item.product.id}>
            {/* <TableCell>{index + 1}</TableCell> */}
            <TableCell>{item.product.name}</TableCell>
            <TableCell>{item.total_rented}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}