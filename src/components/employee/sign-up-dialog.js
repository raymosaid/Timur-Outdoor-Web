import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader } from "../ui/dialog";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { fetchEmployee } from "@/lib/data";

export default function SignUpDialog({setOpen, setEmployee}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSignUp = async (e) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
          data: {
            user_role: "pegawai"
          }
        },
      })
      if (error) throw error

      if (!error) {
          toast({
            title: "Tambah Akun Berhasil",
            description: `Silahkan cek email anda dan lakukan verifikasi`,
          })
          setOpen(false)
          fetchEmployee(setEmployee)
        } else {
          toast({
            variant: "destructive",
            title: "Tambah Akun Gagal",
            description: "Terjadi kesalahan saat menambahkan akun"
          })
        }
      
      // router.push('/auth/sign-up-success')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignUp}>
      <DialogHeader>
        Tambah Pegawai
      </DialogHeader>
      <div className="my-8">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="repeat-password">Repeat Password</Label>
              </div>
              <Input
                id="repeat-password"
                type="password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>
          </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        {/* <Button>Tambah Pegawai</Button> */}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating an account...' : 'Sign up'}
        </Button>
      </DialogFooter>
    </form>
  )
}