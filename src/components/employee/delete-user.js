import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
// import { createClient } from "@/utils/supabase/role-key"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@supabase/supabase-js"
import { fetchEmployee } from "@/lib/data"

export const DeleteUser = ({children, idUser, setEmployee}) => {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
  const { toast } = useToast()

  const onDeleteUser = async() => {
    setPending(true)
    const { data, error } = await supabase.auth.admin.deleteUser(idUser)
    console.log(idUser, data, error)
    if (!error) {
      toast({
        title: "Hapus Akun Berhasil",
        description: `Akun telah berhasl dihapus`,
      })
      setOpen(false)
      fetchEmployee(setEmployee)
    } else {
      toast({
        variant: "destructive",
        title: "Hapus akun gagal",
        description: "Terjadi kesalahan saat menghapus akun"
      })
    }
    setPending(false)
  }

  return(
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Akun?</DialogTitle>
        </DialogHeader>
        <div>Apakah anda yakin ingin menghapus akun ini?</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" disabled={pending} onClick={() => onDeleteUser()}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}