import { DateTimePicker } from "@/components/date-time-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { updatedSellTransactionDetail } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"

export const EditSellDetail = ({
	transaction,
	setIsEdit,
	setTransaction
}) => {
	const [updatedSellTransaction, setUpdatedSellTransaction] = useState(transaction)
	const [pending, setPending] = useState(false)
	const { toast } = useToast()
	const onSaveChanges = async() => {
		setPending(true)
		const {data, error} = await updatedSellTransactionDetail(updatedSellTransaction)
		console.log("update data", data)
		if (!error) {
      toast({
        title: "Update Transaction Successful",
        description: "Transaksi telah berhasil diupdate",
      })
			setTransaction(data[0])
      setIsEdit(false)
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
		<div className="flex flex-col flex-1">
      <div className="grid grid-cols-4 gap-6 mt-4">

        {/* Name */}
        <div className="flex flex-col break-words gap-2">
          <p className="font-medium">Nama Penyewa</p>
          <Input
            value={updatedSellTransaction.name}
            onChange={(e) => setUpdatedSellTransaction(prev => ({ ...prev, name: e.target.value }))}
            name="name"
          />
        </div>

        {/* Nomor Telepon */}
        <div className="flex flex-col break-words gap-2">
          <p className="font-medium">Nomor Telepon</p>
          <Input
            value={updatedSellTransaction.phone_number}
            onChange={(e) => setUpdatedSellTransaction(prev => ({ ...prev, phone_number: e.target.value }))}
            name="phone_number"
          />
        </div>

        {/* Discount */}
        <div className="flex flex-col break-words gap-2">
          <p className="font-medium">Discount</p>
          <Input
            value={formatCurrency(updatedSellTransaction.discount)}
            onChange={(e) => {
              let formattedValue = parseInt(e.target.value.replace(/[^0-9]/g, '') || 0)
              setUpdatedSellTransaction(prev => ({ ...prev, discount: formattedValue }))
            }}
          />
        </div>

        {/* Tanggal Pemesanan */}
        <div className="flex flex-col break-words gap-2">
          <p className="font-medium">Tanggal Pengembalian</p>
          <DateTimePicker
            value={updatedSellTransaction.created_at}
            onChange={(value) => {
              setUpdatedSellTransaction(prev => ({ ...prev, created_at: value }))
            }}
          />
        </div>

        {/* Note */}
        <div className="col-span-4 mt-6 flex flex-col break-words gap-2">
          <p className="font-medium">Note</p>
          <Textarea
            name="note"
            value={updatedSellTransaction.note}
            onChange={(e) => setUpdatedSellTransaction(prev => ({ ...prev, note: e.target.value }))}
            placeholder="Berikan catatan pada transaksi ini."
          />
        </div>
      </div>

      <div className="mt-auto w-full flex flex-row gap-4">
        <Button onClick={() => setIsEdit(false)} variant="outline" className="w-1/3">Cancel</Button>
        <Button onClick={() => onSaveChanges()} className="w-2/3" disabled={!!pending}>{pending ? "Loading..." : "Save Changes"}</Button>
      </div>
  	</div>
  )
}