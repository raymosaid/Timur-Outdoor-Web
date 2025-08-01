'use client'

import SignUpDialog from "@/components/employee/sign-up-dialog";
import { TableEmployee } from "@/components/employee/table-employee";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { fetchEmployee } from "@/lib/data";
import { useEffect, useState } from "react";

export default function Page() {
  const [open, setOpen] = useState(false)
  const [employee, setEmployee] = useState(null)
  
  useEffect(() => {
    fetchEmployee(setEmployee)
  }, [])

  return (
    <>
      <div className="m-[30px] space-y-[30px]">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              Tambah Pegawai
            </Button>
          </DialogTrigger>
          <DialogContent>
            <SignUpDialog setOpen={setOpen} setEmployee={setEmployee}/>
          </DialogContent>
        </Dialog>
        <div className="bg-white p-4 rounded-lg">
          <TableEmployee employee={employee} setEmployee={setEmployee}/>
        </div>
      </div>
    </>
  )
}