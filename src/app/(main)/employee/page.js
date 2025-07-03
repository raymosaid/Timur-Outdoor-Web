'use client'

import SignUpDialog from "@/components/employee/sign-up-dialog";
import { TableEmployee } from "@/components/employee/table-employee";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function Page() {
  return (
    <>
      <div className="m-[30px] space-y-[30px]">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              Tambah Pegawai
            </Button>
          </DialogTrigger>
          <DialogContent>
            <SignUpDialog />
          </DialogContent>
        </Dialog>
        <div className="bg-white p-4 rounded-lg">
          <TableEmployee />
        </div>
      </div>
    </>
  )
}