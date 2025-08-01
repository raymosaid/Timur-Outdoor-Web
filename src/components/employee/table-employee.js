import { useContext, useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { fetchEmployee } from "@/lib/data"
import { Banknote, TrashIcon } from "lucide-react"
import { HeaderContext } from "@/app/(main)/provider"
import { DeleteUser } from "@/components/employee/delete-user"

export const TableEmployee = ({employee, setEmployee}) => {
  const { headerInput } = useContext(HeaderContext)
  const cellName = ["No.", "Nama Pegawai", "Email", "Jabatan", "Nomor Telepon", "Action"]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {cellName.map((item, index) => (
            <TableHead key={index}>{item}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {!!employee && employee.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{item.username}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.user_role}</TableCell>
            <TableCell>{item.phone_number}</TableCell>
            <TableCell className="flex justify-center gap-6"> 
              <DeleteUser idUser={item.id} setEmployee={setEmployee}>
                <TrashIcon color="red" />
              </DeleteUser>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}