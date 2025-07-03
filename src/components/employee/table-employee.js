import { useContext, useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { fetchEmployee } from "@/lib/data"
import { Banknote, TrashIcon } from "lucide-react"
import { HeaderContext } from "@/app/(main)/provider"

export const TableEmployee = () => {
  const { headerInput } = useContext(HeaderContext)
  const cellName = ["No.", "Nama Pegawai", "Email", "Jabatan", "Nomor Telepon", "Action"]
  const [employee, setEmployee] = useState(null)

  useEffect(() => {
    fetchEmployee(setEmployee)
  }, [])

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
              <button>
                <Banknote />
              </button>
              <button>
                <TrashIcon color="red" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}