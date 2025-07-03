import { formatCurrency } from "@/lib/utils"
import { useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { useToast } from "@/hooks/use-toast"
import { insertTransactionsPayments, updateDenda } from "@/lib/data"

export const DendaDanCatatan = ({ children, transaction }) => {
  const [denda, setDenda] = useState(parseInt(transaction?.denda || 0))
  const { toast } = useToast()

  const onSubmit = async() => {
    // const { data, error } = await updateDenda(transaction?.id, denda)
    const { data, error } = await insertTransactionsPayments([{
      transaction_id: transaction.id,
      amount: denda,
      type: "Denda"
    }])
    if (!error) {
      toast({
        title: "Update Denda Successful",
        description: "Berhasil mengupdate denda"
      })
    } else {
      toast({
        variant: "destructive",
        title: "Failed to Update Denda",
        description: "Gagal mengupdate denda",
      })
    }
  } 
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Denda</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="space-y-2">
            <p>Berapa denda yang akan diberikan pada transaksi ini??</p>
            <Input
              placeholder="0"
              value={formatCurrency(denda)}
              onChange={(e) => {
                let formattedValue = parseInt(e.target.value.replace(/[^0-9]/g, '') || 0);
                setDenda(formattedValue)
              }}
            />
          </div>
          {/* <div className="space-y-2">
            <p>Berikan catatan pada transaksi ini</p>
            <Textarea
              placeholder="Masukkan catatan ..."
              defaultValue={transaction?.note}
            />
          </div> */}
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button onClick={onSubmit}>Selesai</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}