'use client'

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchDetailSellTransactions } from "@/lib/data"
import { format, parseISO } from "date-fns"
import { Pencil } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { NotaTransaksiJual } from "@/lib/nota-jual"
import { pdf } from "@react-pdf/renderer"
import { useToast } from "@/hooks/use-toast"

export default function Page() {
  const pathname = useParams()
  const transactionId = pathname.id

  const { toast } = useToast()
  
  const [isEdit, setIsEdit] = useState(false)
  const [transaction, setTransaction] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchDetailSellTransactions(transactionId, setTransaction)
  }, [])
  console.log("Transaction", transaction)

  useEffect(() => {
    if (!!transaction) {
      setData([
        {title: "Nama Penyewa", value: transaction?.name, name: "name"},
        {title: "Nomor Telepon", value: transaction?.phone_number, name: "phone_number"},
        {title: "Metode Pembayaran", value: transaction?.payment_method, name: "payment_method"},
        {title: "Tanggal Pemesanan", value: format(parseISO(transaction?.created_at), "eee, d MMM, HH:mm"), name: "created_at"},
      ])
    }
  }, [transaction])

  const handlePrintNota = async() => {
    const pdfBlob = await pdf(<NotaTransaksiJual transaction={transaction} />).toBlob()
    const url = URL.createObjectURL(pdfBlob);
    window.open(url);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const [pendingKirimNota, setPendingKirimNota] = useState(false)
  const handleKirimNota = async() => {
    setPendingKirimNota(true)
    const pdfBlob = await pdf(<NotaTransaksiJual transaction={transaction} />).toBlob()
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(pdfBlob);
    });

    const responseSendWa = await fetch(`${process.env.NEXT_PUBLIC_WHATSAPP_CLIENT_URL}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: transaction.phone_number,
        base64data: base64,
        message: "Send Media",
        filename: `Nota - ${transaction.name} - ${format(new Date(), "dd MMMM yyyy, HH:mm")}`,
      }),
    });

    if (responseSendWa.status === 200) {
      toast({
        title: "Send Nota Successful",
        description: `Nota telah berhasil dikirim ke nomor ${transaction.phone_number}`,
      })
    } else {
      toast({
        variant: "destructive",
        title: "Failed to send nota",
        description: "Gagal mengirim nota"
      })
    }
    setPendingKirimNota(false)
  }

  return (
    <>
      <div className="m-[30px] bg-white p-8 rounded-lg min-h-[calc(100vh-100px-60px)] flex flex-col">
        <div className="flex justify-between">
          <div className="font-semibold text-xl">Detail Transaksi</div>
          {!isEdit && <Button onClick={() => setIsEdit(true)}><Pencil />Edit Transaksi</Button>}
        </div>

        {!isEdit &&  (
          <>
            {!!data ? (
              <>
                <div className="grid grid-cols-3 gap-6 mt-4">
                  {data.map((item, index) => (
                    <div className="flex flex-col break-words gap-2" key={index}>
                      <p className="font-medium">{item.title}</p>
                      <p className={item.className}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-col break-words gap-2">
                  <p className="font-medium">Note</p>
                  <div className="min-h-[100px]">{transaction?.note}</div>
                </div>
              </>
            ) : <div>Loading</div>}
            {!!transaction && (
              <div>
                <p className="text-xl font-semibold">Items</p>
                <TableDetailItems items={transaction.sell_items} transaction={transaction} />
              </div>
            )}
          </>
        )}
        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            disabled={!transaction}
            onClick={() => handlePrintNota()}
          >
            Print Nota
          </Button>
          <Button
            variant="outline"
            disabled={!transaction || !!pendingKirimNota}
            onClick={() => handleKirimNota()}
          >Kirim Nota</Button>
        </div>
      </div>
    </>
  )
}

const TableDetailItems = ({ items, transaction }) => {
  const detail = [
    {title: "Sub Total", value: items.reduce((acc, obj) => acc + obj.price_at_transaction * obj.quantity, 0)},
    {title: "Diskon", value: transaction.discount},
    {title: "Total", value: transaction.total_amount},
  ]
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Barang</TableHead>
          <TableHead>Harga</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{index+1}</TableCell>
            <TableCell>{item.product?.name}</TableCell>
            <TableCell>{item.price_at_transaction}</TableCell>
            <TableCell>{item.quantity}</TableCell>
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
        {detail.map((item, index) => (
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