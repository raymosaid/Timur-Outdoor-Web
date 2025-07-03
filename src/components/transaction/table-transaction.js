import { formatCurrency } from "@/lib/utils"
import { addHours, format, isValid, parseISO } from "date-fns"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { DeleteTransaction } from "./delete-transaction"

export const TableTransaction = ({ listTransaction, setListTransaction, type }) => {
  const router = useRouter()

  return (
    <div className="h-[63vh] relative overflow-y-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-secondary">
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Nama</TableHead>
            {/* {type === "sewa" && <TableHead>DP</TableHead>} */}
            {type === "sewa" && <TableHead>Pembayaran</TableHead>}
            {type === "sewa" && <TableHead>Jaminan</TableHead>}
            <TableHead>No. Telepon</TableHead>
            {type === "sewa" && <TableHead>Pengambilan</TableHead>}
            {type === "sewa" && <TableHead>Hari Sewa</TableHead>}
            <TableHead>Total</TableHead>
            {type === "sewa" && <TableHead>Status</TableHead>}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!!listTransaction && listTransaction.length > 0 && listTransaction.map((item, index) => (
            <TableRow
              key={item.id}
              onClick={() => router.push(type === 'sewa' ? `transaction/${item.id}/` : `transaction/sell/${item.id}/`)}
              className="cursor-pointer hover:bg-primary/20"
            >
              <TableCell>{index+1}</TableCell>
              <TableCell>{item.name}</TableCell>
              {/* {type === "sewa" && <TableCell>{formatCurrency(item.down_payment)}</TableCell>} */}
              {type === "sewa" && <TableCell>{formatCurrency(item?.transactions_payments?.reduce((acc, obj) => acc + obj.amount, 0) || 0)}</TableCell>}
              {type === "sewa" && <TableCell>{item.jaminan}</TableCell>}
              <TableCell>{item.phone_number}</TableCell>
              {type === "sewa" && (
                <TableCell>
                  {item.tanggal_pengambilan
                    ? isValid(parseISO(item.tanggal_pengambilan))
                      ? format(parseISO(item.tanggal_pengambilan), "eee, d MMM, HH:mm")
                      : "Invalid date"
                    : "Loading..."}
                </TableCell>
              )}
              {type === "sewa" && <TableCell>{item.hari_sewa}</TableCell>}
              <TableCell>{formatCurrency(item.total_amount)}</TableCell>
              {type === "sewa" && <TableCell className={(item.status === 'Sewa' && addHours(item.tanggal_pengembalian, 5) < new Date()) ? "text-red-500 font-medium" : ""}>{item.status === "Sewa" ? "Berlangsung" : item.status}</TableCell>}
              <TableCell
                onClick={(e) => {
                  e.stopPropagation()
                }}
                className="hover:bg-primary/30 p-0"
              >
                <DeleteTransaction
                  transaction={item}
                  setListTransaction={setListTransaction}
                  type={type}
                >
                  <div className="flex w-full h-full justify-center">
                    <button className="text-red-600 flex items-center">
                      <Trash2 className="" size={16} />
                    </button>   
                  </div>
                </DeleteTransaction>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}