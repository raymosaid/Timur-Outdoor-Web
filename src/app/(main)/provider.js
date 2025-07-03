'use client'

import { useUserData } from "@/lib/data"
import { endOfDay, startOfDay, subDays } from "date-fns"
import { createContext, useState } from "react"

export const HeaderContext = createContext()
export const DashboardContext = createContext()

export const Provider = ({ children }) => {
  const { data: user } = useUserData()
  const [headerInput, setHeaderInput] = useState('')
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(20)
  const [date, setDate] = useState({
    from: subDays(startOfDay(new Date()), 30),
    to: endOfDay(new Date()),
  })

  return (
    <HeaderContext.Provider
      value={{
        user,
        headerInput,
        setHeaderInput,
      }}
    >
      <DashboardContext.Provider
        value={{
          page,
          setPage,
          limit,
          setLimit,
          date,
          setDate,
        }}
      >
        {children}
      </DashboardContext.Provider>
    </HeaderContext.Provider>
  )
}