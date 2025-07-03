'use client'

import { Button } from "@/components/ui/button";
import { TableTransaction } from "@/components/transaction/table-transaction"
import { fetchItemsTransactionsList, fetchSellItems, fetchSellTransaction, fetchTransactionsList, getCountRows } from "@/lib/data";
import { useContext, useEffect, useState } from "react";
import DateRangePicker from "@/components/DateRangePicker";
import { DashboardContext, HeaderContext } from "../provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableItems } from "@/components/transaction/table-items";
import { Pagination } from "@/components/transaction/pagination"

export default function Page() {
  const { date, setDate, limit, page } = useContext(DashboardContext)
  const { headerInput } = useContext(HeaderContext)
  
  const [listTransaction, setListTransaction] = useState(null)
  const [listItemsTransaction, setListItemsTransactions] = useState(null)
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('sewa')
  const [transactionsRow, setTransactionsRow] = useState(null)
  const [transactionsItemsRow, setTransactionsItemsRow] = useState(null)

  useEffect(() => {
    const range = {
      from: page * limit,
      to: page * limit + limit - 1
    }
    if (type === 'sewa') {
      fetchTransactionsList(setListTransaction, headerInput, date, status, range)
      fetchItemsTransactionsList(setListItemsTransactions, headerInput, date, status, range)
      getCountRows('transactions', date, setTransactionsRow, status, headerInput)
      getCountRows('transaction_items', date, setTransactionsItemsRow, status, headerInput)
    } else {
      fetchSellTransaction(setListTransaction, headerInput, date, range)
      fetchSellItems(setListItemsTransactions, headerInput, date, range)
    }
  }, [headerInput, date, status, limit, page, type])

  return (
    <>
      <div className="flex flex-col m-[30px] gap-[25px]">
        <div className="flex justify-between items-center">
          <div>
            <Button
              variant={type === "sewa" ? "" : "outline"}
              className="rounded-none rounded-l-md"
              onClick={() => setType("sewa")}
            >Sewa</Button>
            <Button
              variant={type === "jual" ? "" : "outline"}
              className="rounded-none rounded-r-md"
              onClick={() => setType("jual")}
            >Jual</Button>
          </div>
          <DateRangePicker
            date={date}
            setDate={setDate}
          />
        </div>
        <Tabs defaultValue="transactions">
          <div className="flex justify-between items-center">
            <TabsList className="bg-primary">
              <TabsTrigger value="transactions" className={`text-primary-foreground`}>Transaction</TabsTrigger>
              <TabsTrigger value="items" className={`text-primary-foreground`}>Items</TabsTrigger>
            </TabsList>
            {type === "sewa" && (
              <div className="flex">
                <Button
                  variant={status === "all" ? "" : "outline"}
                  className="rounded-none rounded-l-lg"
                  onClick={() => setStatus("all")}
                >
                  Semua
                </Button>
                <Button
                  variant={status === "Booking" ? "" : "outline"}
                  className="rounded-none"
                  onClick={() => setStatus("Booking")}
                >
                  Booking
                </Button>
                <Button
                  variant={status === "Sewa" ? "" : "outline"}
                  className="rounded-none"
                  onClick={() => setStatus("Sewa")}
                >
                  Berlangsung
                </Button>
                <Button
                  variant={status === "Selesai" ? "" : "outline"}
                  className="rounded-none rounded-r-lg"
                  onClick={() => setStatus("Selesai")}
                >
                  Selesai
                </Button>
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg mt-4">
            <TabsContent value="transactions">
              <TableTransaction
                listTransaction={listTransaction}
                setListTransaction={setListTransaction}
                type={type}
              />
              <Pagination totalRows={transactionsRow} rowsShowed={listTransaction?.length || 0} />
            </TabsContent>
            <TabsContent value="items">
              <TableItems
                listItemsTransactions={listItemsTransaction}
                type={type}
              />
              <Pagination totalRows={transactionsItemsRow} rowsShowed={listItemsTransaction?.length ||  0} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  )
}