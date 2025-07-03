import { useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { deleteSellTransaction, deleteTransaction } from "@/lib/data"

export const DeleteTransaction = ({ children, transaction, setListTransaction, type }) => {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleDelete = async() => {
    if (type === "sewa") {
      const { error } = await deleteTransaction(transaction.id)
      if (!error) {
        toast({
          title: "Transaksi Dihapus",
          description: "Berhasil menghapus transaksi",
        })
        setOpen(!open)
        setListTransaction(prev => (prev.filter(d => d.id !== transaction.id)))
      } else {
        toast({
          variant: "destructive",
          title: "Gagal menghapus transaksi",
          description: error.message
        })
      }
    } else {
      const { error } = await deleteSellTransaction(transaction.id)
      if (!error) {
        toast({
          title: "Transaksi Dihapus",
          description: "Berhasil menghapus transaksi",
        })
        setOpen(!open)
        setListTransaction(prev => (prev.filter(d => d.id !== transaction.id)))
      } else {
        toast({
          variant: "destructive",
          title: "Gagal menghapus transaksi",
          description: error.message
        })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
        </DialogHeader>
        <div className="my-2">Are you sure want to delete this transaction??</div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={() => handleDelete()} variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}