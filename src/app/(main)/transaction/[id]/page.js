'use client'

import { EditItems } from "@/components/transaction/detail/edit-items";
import { addProductMaintenance, fetchDetailTransaction, fetchUserData } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { addHours, format, parseISO } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { TableDetailItems } from "@/components/transaction/table-detail-items"
import { TableDetailPayments } from "@/components/transaction/table-detail-payments"
import { Button } from "@/components/ui/button";
import { DendaDanCatatan } from "@/components/transaction/denda-catatan";
import { akhiriTransaksi } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { pdf } from "@react-pdf/renderer";
import { NotaTransaksi } from "@/components/transaction/nota-transaction"
import { Pencil } from "lucide-react";
import { EditTransaction } from "@/components/transaction/detail/edit-transaction"

export default function Page() {
  const pathname = useParams()
  const transactionId = pathname.id

  const [transaction, setTransaction] = useState(null)
  const [dataDisplay, setDataDisplay] = useState([])
  const [isEdit, setIsEdit] = useState(false)


  const { toast } = useToast()
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const fetchTransaction = useCallback(() => {
    fetchDetailTransaction(transactionId, setTransaction)
  }, [])

  useEffect(() => {
    fetchTransaction()
  }, [])

  useEffect(() => {
    if (!!transaction) {
      const display = [
        {title: "Nama Penyewa", value: transaction.name, name: "name"},
        {title: "Nomor Telepon", value: transaction.phone_number, name: "phone_number"},
        // {title: "Metode Pembayaran", value: transaction.payment_method, name: "payment_method"},
        {title: "Jaminan", value: transaction.jaminan, name: "jaminan"},
        // {title: "Down Payment", value: formatCurrency(transaction.down_payment), name: "down_payment"},
        // {title: "Denda", value: formatCurrency(transaction.transactions_payments.filter(d => d.type === "Denda").reduce((acc, obj) => acc + obj.amount, 0)), name: "denda"},
        {title: "Total", value: formatCurrency(transaction.total_amount), name: "total_amount"},
        {title: "Status Transaksi", value: transaction.is_return ? "Selesai" : "Belum Selesai", className: `font-medium ${transaction.is_return ? "text-blue-700" : "text-red-600"}`, name: "is_return"},
        {title: "Tanggal Pemesanan", value: format(parseISO(transaction.created_at), "eee, d MMM, HH:mm"), name: "created_at"},
        {title: "Tanggal Pengambilan", value: format(parseISO(transaction.tanggal_pengambilan), "eee, d MMM, HH:mm"), name: "tanggal_pengambilan"},
        {title: "Tanggal Pengembalian", value: format(parseISO(transaction.tanggal_pengembalian), "eee, d MMM, HH:mm"), className: `${(!transaction.is_return && addHours(transaction.tanggal_pengembalian, 5) < new Date()) ? "text-red-500 font-medium" : ""}`, name: "tanggal_pengembalian"},
      ]
      setDataDisplay(display)
    }
  }, [transaction])

  const handleSelesai = async() => {
    setPending(true)
    const response = await akhiriTransaksi(transactionId)
    const result = await Promise.all(
      transaction.transaction_items.map(item => addProductMaintenance(item.product, item.quantity))
    )
    if (response.status === "error") {
      toast({
        variant: "destructive",
        title: "Gagal menyelsaikan transaksi",
        description: response.error.message
      })
    } else {
      toast({
        title: "Transaksi Selesai",
        description: "Berhasil mengubah transaksi",
      })
      router.push("/transaction")
    } 
    setPending(false)
  }

  const printNota = async() => {
    const pdfBlob = await pdf(<NotaTransaksi transaction={transaction} listItemOrder={transaction?.transaction_items} />).toBlob()
    const url = URL.createObjectURL(pdfBlob);
    window.open(url);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const [pendingKirimNota, setPendingKirimNota] = useState(false)
  const kirimNota = async() => {
    setPendingKirimNota(true)
    const pdfBlob = await pdf(<NotaTransaksi transaction={transaction} listItemOrder={transaction?.transaction_items} />).toBlob()
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
        {!!dataDisplay && !isEdit && (
          <>
            <div className="grid grid-cols-4 gap-6 mt-4">
              {dataDisplay.map((item, index) => (
                <div className="flex flex-col break-words gap-2" key={index}>
                  <p className="font-medium">{item.title}</p>
                  <p className={item.className}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col break-words gap-2">
              <p className="font-medium">Note</p>
              <div>{transaction?.note}</div>
            </div>
          </>
        )}
        {!!transaction && !!isEdit && <EditTransaction transaction={transaction} setIsEdit={setIsEdit} setTransaction={setTransaction} />}

        {!isEdit && (
          <>
            <div className="mt-4">
              <div className="font-semibold text-xl mb-4">Pembayaran</div>
              <TableDetailPayments data={transaction?.transactions_payments} />
            </div>
            <div className="mt-12">
              <div className="flex justify-between mb-4">
                <div className="font-semibold text-xl">Barang yang disewa</div>
                {/* <Button onClick={() => router.push(`/transaction/${transactionId}/edit`)}>
                  <Pencil /> Edit Item
                </Button> */}
                {!!transaction && <EditItems transaction={transaction} setTransaction={setTransaction}/>}
              </div>
              {!!transaction ?
                <TableDetailItems
                  listItems={transaction.transaction_items}
                  transaction={transaction}
                /> : 
                <div>Loading...</div>
              }
            </div>
            <div className="flex gap-2 mt-auto">
              <Button variant="outline" onClick={() => printNota()}>Print Nota</Button>
              <Button
                variant="outline"
                onClick={() => kirimNota()}
                disabled={!!pendingKirimNota}
              >
                {!!pendingKirimNota ? "Loading..." : "Kirim Nota"}
              </Button>
              {/* {!!transaction && (
                <DendaDanCatatan
                  transaction={transaction}
                >
                  <Button variant="outline">Denda</Button>
                </DendaDanCatatan>
              )} */}
              {transaction && !transaction.is_return && addHours(transaction.tanggal_pengembalian, 5) < new Date() && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Akhiri Transaksi</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Akhiri Transaksi</DialogTitle>
                    </DialogHeader>
                    <div className="my-6">Pelanggan ini terkena denda, apakah anda yakin ingin mengakhiri transaksi ini??</div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="">Cancel</Button>
                      </DialogClose>
                      <Button
                        disabled={pending}
                        onClick={handleSelesai}
                        variant="destructive"
                      >
                        {pending ? "Loading..." : "Akhiri Transaksi"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              {transaction && !transaction.is_return && addHours(transaction.tanggal_pengembalian, 5) >= new Date() && (
                <Button
                  disabled={pending}
                  onClick={handleSelesai}
                >
                  {pending ? "Loading..." : "Akhiri Transaksi"}
                </Button>
              )}
            </div>
          </>
        )} 
        {/* ) : <Button className="mt-auto" onClick={() => setIsEdit(false)}>Save Changes</Button>} */}
      </div>
    </>
  )
}