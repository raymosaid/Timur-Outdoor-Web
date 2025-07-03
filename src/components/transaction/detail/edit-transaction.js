import { DateTimePicker } from "@/components/date-time-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { deleteTransactionsPayments, editTransactionDetail, fetchDetailTransaction, insertTransactionsPayments, updatedTransactionsPayments, updateTransactionItem } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { PlusIcon, TrashIcon } from "lucide-react"
import { useState } from "react"

export const EditTransaction = ({ transaction, setIsEdit, setTransaction }) => {
  const [pending, setPending] = useState(false)
  const [name, setName] = useState(transaction.name)
  const [phoneNumber, setPhoneNumber] = useState(transaction.phone_number)
  const [jaminan, setJaminan] = useState(transaction.jaminan)
  const [discount, setDiscount] = useState(transaction?.discount || 0)
  const [tanggalPengambilan, setTanggalPengambilan] = useState(parseISO(transaction.tanggal_pengambilan))
  const [tanggalPengembalian, setTanggalPengembalian] = useState(parseISO(transaction.tanggal_pengembalian))
  const [note, setNote] = useState(transaction.note)
  const [status, setStatus] = useState(transaction.status)
  const [payments, setPayments] = useState(transaction.transactions_payments)

  // const oldPaymentsIds = transaction.transactions_payments.map((item) => item.id)
  // const newPaymentsIds = payments.map((item) => item.id).filter((id) => id !== undefined)
  // console.log("oldIds", oldIds, "newIds", newIds)
  // console.log("Payments", payments)
  // console.log("Delete", transaction.transactions_payments.filter(item => !newIds.includes(item.id)))
  // console.log("Add", payments.filter(d => !('id' in d)))
  // console.log("Updates", payments.filter(item => oldIds.includes(item.id)))

  const { toast } = useToast()
  
  const handlePaymentAmountChange = (index, value) => {
    const newPayments = [...payments]
    let formattedValue = parseInt(value.replace(/[^0-9]/g, '') || 0);
    newPayments[index].amount = formattedValue
    setPayments(newPayments)
  }
  
  const handlePaymentMethodChange = (index, value) => {
    const newPayments = [...payments]
    newPayments[index].method = value
    setPayments(newPayments)
  }

  const handlePaymentTypeChange = (index, value) => {
    const newPayments = [...payments]
    newPayments[index].type = value
    setPayments(newPayments)
  }

  const handlePaymentDateChange = (index, value) => {
    console.log("Date Change", value)
    const newPayments = [...payments]
    newPayments[index].created_at = value
    setPayments(newPayments)
  }

  const handleAddPayments = () => {
    setPayments(prev => [ ...prev, { amount: 0, method: 'CASH', type: '', created_at: new Date() } ])
  }
  const handleDeletePayments = (index) => {
    const newPayments = payments.filter((_, i) => i !== index);
    setPayments(newPayments);
  }

  const onSaveChanges = async(e) => {
    e.preventDefault()
    setPending(true)
    const formData = new FormData(e.target)
    formData.set("tanggal_pengambilan", format(tanggalPengambilan, "yyyy-MM-dd HH:mm:ss"))
    formData.set("tanggal_pengembalian", format(tanggalPengembalian, "yyyy-MM-dd HH:mm:ss"))
    formData.set("discount", discount)
    formData.set("status", status)

    if (discount !== transaction.discount) {
      formData.set("total_amount", transaction?.transaction_items?.reduce((acc, obj) => acc + obj.price_at_transaction * obj.quantity , 0) * transaction?.hari_sewa - discount)
    }

    const dataEntries = Object.fromEntries(formData.entries())
    const { data, error } = await editTransactionDetail(transaction.id, dataEntries)

    const oldPaymentsIds = transaction.transactions_payments.map((item) => item.id)
    const newPaymentsIds = payments.map((item) => item.id).filter((id) => id !== undefined)
    const updatedPayments = payments.filter(item => oldPaymentsIds.includes(item.id))
    const deletedPayments = transaction.transactions_payments.filter(item => !newPaymentsIds.includes(item.id))
    let insertedPayments = payments.filter(d => !('id' in d))
    insertedPayments = insertedPayments.map(prev => ({
      ...prev,
      transaction_id: transaction.id
    }))

    const updatePaymentsResponse = await Promise.all(
      updatedPayments.map(payment => updatedTransactionsPayments(payment))
    )
    const deletePaymentsResponse = await Promise.all(
      deletedPayments.map(payment => deleteTransactionsPayments(payment.id))
    )
    const insertPaymentsResponse = await insertTransactionsPayments(insertedPayments)
    console.log(updatePaymentsResponse, deletePaymentsResponse, insertPaymentsResponse)

    if (!error) {
      toast({
        title: "Update Transaction Successful",
        description: "Transaksi telah berhasil diupdate",
      })
      setIsEdit(false)
      fetchDetailTransaction(transaction.id, setTransaction)
    } else {
      toast({
        variant: "destructive",
        title: "Gagal mengupdate transaksi",
        description: error
      })
    }

    setPending(false)
  }

  return (
    <form onSubmit={onSaveChanges} className="flex flex-col flex-1">
      <div className="grid grid-cols-4 gap-6 mt-4">

        {/* Name */}
        <div className="flex flex-col break-words gap-2">
          <p className="font-medium">Nama Penyewa</p>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
          />
        </div>

        {/* Nomor Telepon */}
        <div className="flex flex-col break-words gap-2">
          <p className="font-medium">Nomor Telepon</p>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            name="phone_number"
          />
        </div>

        {/* Metode Pembayaran */}
        {/* <div className="flex flex-col break-words gap-2">
          <p className="font-medium">Metode Pembayaran</p>
          <Input
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            name="payment_method"
          />
        </div> */}

        {/* Jaminan */}
        <div className="flex flex-col break-words gap-2">
          <p className="font-medium">Jaminan</p>
          <Input
            value={jaminan}
            onChange={(e) => setJaminan(e.target.value)}
            name="jaminan"
          />
        </div>

        {/* Down Payment */}
        {/* <div className="flex flex-col break-words gap-2">
          <p className="font-medium">Down Payment</p>
          <Input
            value={formatCurrency(downPayment)}
            onChange={(e) => {
              let formattedValue = parseInt(e.target.value.replace(/[^0-9]/g, '') || 0)
              setDownPayment(formattedValue)
            }}
          />
        </div> */}

        {/* Discount */}
        <div className="flex flex-col break-words gap-2">
          <p className="font-medium">Discount</p>
          <Input
            value={formatCurrency(discount)}
            onChange={(e) => {
              let formattedValue = parseInt(e.target.value.replace(/[^0-9]/g, '') || 0)
              setDiscount(formattedValue)
            }}
          />
        </div>

        {/* Tanggal Pengambilan */}
        <div className="flex flex-col break-words gap-2">
          <p className="font-medium">Tanggal Pengambilan</p>
          <DateTimePicker
            value={tanggalPengambilan}
            onChange={(value) => {
              setTanggalPengambilan(value)
            }}
          />
        </div>

        {/* Tanggal Pengembalian */}
        <div className="flex flex-col break-words gap-2">
          <p className="font-medium">Tanggal Pengembalian</p>
          <DateTimePicker
            value={tanggalPengembalian}
            onChange={(value) => {
              setTanggalPengembalian(value)
            }}
          />
        </div>

        {/* Status */}
        <div className="flex flex-col break-words gap-2">
          <p className="font-medium">Status</p>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sewa">Sewa</SelectItem>
              <SelectItem value="Booking">Booking</SelectItem>
              <SelectItem value="Selesai">Selesai</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Payments */}
        <div className="col-span-4 flex flex-col gap-2">
          <p className="font-medium">Pembayaran</p>
          <div className="flex flex-col gap-2">
            {payments.map((item, index) => (
              <div className="grid grid-cols-12 gap-2">
                <Input
                  type="text"
                  value={formatCurrency(item.amount)}
                  onChange={(e) => handlePaymentAmountChange(index, e.target.value)}
                  placeholder="Diskon"
                  className="col-span-3"
                />
                <div className="col-span-2">
                  <Select value={item.method} onValueChange={(value) => handlePaymentMethodChange(index, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Metode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">CASH</SelectItem>
                      <SelectItem value="QRIS">QRIS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Select value={item.type || ''} onValueChange={(value) => handlePaymentTypeChange(index, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Down Payment">Down Payment</SelectItem>
                      <SelectItem value="Pelunasan">Pelunasan</SelectItem>
                      <SelectItem value="Denda">Denda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-4">
                  <DateTimePicker
                    value={typeof item.created_at === 'string' ? parseISO(item.created_at) : item.created_at}
                    onChange={(value) => handlePaymentDateChange(index, value)}
                  />
                </div>
                <Button variant="icon" onClick={() => handleDeletePayments(index)}><TrashIcon color="red" /></Button>
              </div>
            ))}
          </div>
          <Button onClick={handleAddPayments} variant="ghost" className="w-full mt-2"><PlusIcon /> Tambah</Button>
        </div>

        {/* Note */}
        <div className="col-span-4 mt-6 flex flex-col break-words gap-2">
          <p className="font-medium">Note</p>
          <Textarea
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Berikan catatan pada transaksi ini."
          />
        </div>

      </div>

      <div className="mt-auto w-full flex flex-row gap-4">
        <Button onClick={() => setIsEdit(false)} variant="outline" className="w-1/3">Cancel</Button>
        <Button type="submit" className="w-2/3" disabled={!!pending}>{pending ? "Loading..." : "Save Changes"}</Button>
      </div>
    </form>
  )
}