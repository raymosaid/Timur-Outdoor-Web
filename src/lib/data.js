import { createClient } from  "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query";
import { addDays, endOfDay, format, startOfDay, subDays } from "date-fns";
import { createDateRangeWithValues } from "./utils";

const supabase = createClient()

export const fetchUserData = async(setUserData) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  setUserData(user)
}

export const useUserData = () => {
  return useQuery({
    queryKey: [`userData`],
    queryFn: async() => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) console.error(error)
      else return user
    }
  })
}

export const fetchProductList = async(setListProduct, search) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`*, total_rented:transaction_items(transaction_id!inner(is_return), quantity)`)
    .eq("transaction_items.transaction_id.is_return", false)
    .ilike("name", `%${search}%`)
  if (!error) {
    if (!!data) {
      const formattedData = data.map(product => ({
        ...product,
        total_rented: product.total_rented
          .reduce((sum, item) => sum + item.quantity, 0),
        tersedia: product.jumlah_barang - product.barang_maintenance - product.total_rented
          .reduce((sum, item) => sum + item.quantity, 0)
      }))
      setListProduct(formattedData)
    }
  }
}

export const fetchCatalogueList = async(setListProducts) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`*, total_rented:transaction_items(transaction_id!inner(is_return), quantity)`)
    .eq("transaction_items.transaction_id.is_return", false)
    .limit(8)
  if (!error) {
    if (!!data) {
      const formattedData = data.map(product => ({
        ...product,
        total_rented: product.total_rented
          .reduce((sum, item) => sum + item.quantity, 0),
        tersedia: product.jumlah_barang - product.barang_maintenance - product.total_rented
          .reduce((sum, item) => sum + item.quantity, 0)
      }))
      setListProducts(formattedData)
    }
  }
}

export const fetchTransactionsList = async(setListTransactions, search, date, status, range) => {
  const supabase = await createClient()
  const fromDate = date?.from ? new Date(date.from) : subDays(new Date(), 30)
  const toDate = date?.to ? new Date(date.to) : addDays(new Date(), 30)

  if (status === "all") {
    const { data, error } = await supabase
      .from("transactions")
      .select("*, transactions_payments (*)")
      .range(range?.from, range?.to)
      .gte("created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
      .lte("created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
      .ilike("name", `%${search}%`)
      .order("created_at", { ascending: false })
    if (!error) {
      setListTransactions(data)
    }
  } else {
    const { data, error } = await supabase
      .from("transactions")
      .select("*, transactions_payments (*)")
      .range(range?.from, range?.to)
      .gte("created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
      .lte("created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
      .eq("status", status)
      .ilike("name", `%${search}%`)
      .order("created_at", { ascending: false })
    if (!error) {
      setListTransactions(data)
    }
  }
}

export const fetchItemsTransactionsList = async(setListItemsTransactions, search, date, status, range) => {
  const supabase = await createClient()
  const fromDate = date?.from ? new Date(date.from) : subDays(new Date(), 30)
  const toDate = date?.to ? new Date(date.to) : addDays(new Date(), 30)
  const query = supabase
    .from("transaction_items")
    .select('*, transaction:transaction_id!inner(*), product:product_id!inner(*)')
    .range(range?.from, range?.to)
    .gte("transaction.created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
    .lte("transaction.created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
    .ilike("product.name", `%${search}%`)
    .order("transaction(created_at)", { ascending: false })
  if (status !== "all") query.eq("transaction_id.status", status)
  const { data, error } = await query
  if (!error) {
    setListItemsTransactions(data)
  }
}


export const fetchDetailTransaction = async(transactionId, setListTransaction) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select(`*, transaction_items (*, product:product_id (*)), transactions_payments (*)`)
    .eq("id", transactionId)
    .order('created_at', { referencedTable: 'transactions_payments', ascending: true })

  if (!error) {
    setListTransaction(data[0])
  }
}

export const deleteTransaction = async(transactionId) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .delete()
    .eq('id', transactionId)
  return { data, error }
}


export const fetchEmployee = async(setState) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select('*')
  if (!!data) {
    setState(data)
  }
}

export const updateProduct = async(patchData, product) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .update(patchData)
    .eq('id', product.id)
    .select()
  return { data, error }
}


export const addProductMaintenance = async(product, quantity) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .rpc('add_product_maintenance', {
      product_id: product.id,
      quantity: quantity
    })
  return { data, error }
}

export const subProductMaintenance = async(product, quantity) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .rpc('sub_product_maintenance', {
      product_id: product.id,
      quantity: quantity
    })
  return { data, error }
}

export const fetchProductsMaintenance = async(search) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select('*')
    .gt('barang_maintenance', 0)
    .ilike("name", `%${search}%`)
  return { data, error }
}


export const updateTransactionItem = async(transactionItemId, item) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transaction_items")
    .update(item)
    .eq("id", transactionItemId)
    .select()
  return { data, error }
}

export const insertTransactionItem = async(item) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transaction_items")
    .insert([item])
    .select()
  return { data, error }
}

export const deleteTransactionItem = async(itemId) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transaction_items")
    .delete()
    .eq("id", itemId)
  return { data, error }
}

export const editTransactionDetail = async(transactionId, updated) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transactions")
    .update(updated)
    .eq("id", transactionId)
    .select(`*, transaction_items (*, product:product_id (*))`)
  return { data, error }
}

export const updateDenda = async(transactionId, denda) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transactions")
    .update({ "denda": denda })
    .eq('id', transactionId)
    .select()
  return { data, error }
}

export const getCountRows = async(table, date, setState, status, search) => {
  const fromDate = date?.from ? new Date(date.from) : subDays(new Date(), 30)
  const toDate = date?.to ? new Date(date.to) : addDays(new Date(), 30)
  const supabase = await createClient()
  let query = supabase
    .from(table)
    .select(`*${table === "transaction_items" ? ", transaction_id!inner(*), product_id!inner(*)" : ""}`, { count: 'exact', head: true })
    .gte(`${table === "transaction_items" ? "transaction_id." : ""}created_at`, format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
    .lte(`${table === "transaction_items" ? "transaction_id." : ""}created_at`, format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
  if (status !== "all" && table === "transaction_items") query.eq("transaction_id.is_return", status === "in-progress" ? false : true)
  if (status !== "all" && table === "transactions") query.eq("is_return", status === "in-progress" ? false : true)
  if (search && table === 'transaction_items') { query = query.ilike("product.name", `%${search}%`) }
  if (search && table === 'transactions') { query = query.ilike("name", `%${search}%`) }

  const { count, error } = await query
  if (!error) setState(count)
}


export const addJualTransaction = async(transaction, items) => {
  const supabase = await createClient()
  const { data: dataTransaction, error: errorTransaction } = await supabase
    .from('sell_transactions')
    .insert(transaction)
    .select()
  
  if (!!errorTransaction) {
    return {
      status: "500",
      error: errorTransaction
    }
  }

  const transactionId = dataTransaction[0].id
  const items_order = items.map(({ product, ...rest }) => ({
    transaction: transactionId,
    product: product.id,
    ...rest,
  }))

  const { data: dataItems, error: errorItems } = await supabase
    .from('sell_items')
    .insert(items_order)
    .select()

  if (!errorItems) return {
    status: "200",
    data_transaction: dataTransaction,
    data_items: dataItems,
  }
  if (!!errorItems) return {
    status: "500",
    error: errorItems
  }
}

export const fetchSellTransaction = async(setListTransactions, search, date, range) => {
  const supabase = await createClient()
  const fromDate = date?.from ? new Date(date.from) : subDays(new Date(), 30)
  const toDate = date?.to ? new Date(date.to) : addDays(new Date(), 30)
  const query = supabase
    .from("sell_transactions")
    .select('*')
    .range(range?.from, range?.to)
    .gte("created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
    .lte("created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
    .ilike("name", `%${search}%`)
    .order("created_at", { ascending: false })
  const { data, error } = await query
  if (!error) {
    setListTransactions(data)
  }
}

export const fetchSellItems = async(setListItemsTransactions, search, date, range) => {
  const supabase = await createClient()
  const fromDate = date?.from ? new Date(date.from) : subDays(new Date(), 30)
  const toDate = date?.to ? new Date(date.to) : addDays(new Date(), 30)
  const query = supabase
    .from("sell_items")
    .select('*, transaction!inner(*), product!inner(*)')
    .range(range?.from, range?.to)
    .gte("created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
    .lte("created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
    .ilike("product.name", `%${search}%`)
    .order("created_at", { ascending: false })
  const { data, error } = await query
  if (!error) {
    setListItemsTransactions(data)
  }
}

export const deleteSellTransaction = async(transactionId) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sell_transactions")
    .delete()
    .eq('id', transactionId)
  return { data, error }
}

export const fetchDetailSellTransactions = async(transactionId, setState) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sell_transactions")
    .select('*, sell_items (*, product (*))')
    .eq('id', transactionId)
  if (!!setState) setState(data[0])
  return { data, error }
}


export const useFetchTransactionsPayments = () => {
  return useQuery({
    queryKey: ['transactionsPayments'],
    queryFn: async() => {
      let { data: transactions_payments, error } = await supabase
        .from('transactions_payments')
        .select('*')
      if (!!error) throw error
      return transactions_payments
    }
  })
}

export const useSumTransactionsPayments = ( date ) => {
  const fromDate = date?.from ? new Date(date.from) : subDays(new Date(), 30)
  const toDate = date?.to ? new Date(date.to) : addDays(new Date(), 30)
  return useQuery({
    queryKey: [`sumTransactionsPayments${fromDate}${toDate}`],
    queryFn: async() => {
      let { data, error } = await supabase
        .from('transactions_payments')
        .select('amount.sum()')
        .gte("created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
        .lte("created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
      if (!!error) throw error

      let { data: sum_by_date, error: error_by_date } = await supabase
        .from('transactions_payments')
        .select('date:created_at::date, amount.sum()')
        .gte("created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
        .lte("created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
      if (!!error_by_date) throw error

      let { data: sum_by_method, error: error_by_method } = await supabase
        .from('transactions_payments')
        .select('method, amount.sum()')
        .gte("created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
        .lte("created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
      if (!!error_by_method) throw error

      return {
        total: data[0].sum,
        date: sum_by_date,
        method: sum_by_method
      }
    }
  })
}

export const useSumSellTransactions = ( date ) => {
  const fromDate = date?.from ? new Date(date.from) : subDays(new Date(), 30)
  const toDate = date?.to ? new Date(date.to) : addDays(new Date(), 30)
  return useQuery({
    queryKey: [`sumSellTransactions${fromDate}${toDate}`],
    queryFn: async() => {
      let { data, error } = await supabase
        .from('sell_transactions')
        .select('total_amount.sum()')
        .gte("created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
        .lte("created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
      if (!!error) throw error

      let { data: sum_by_date, error: error_by_date } = await supabase
        .from('sell_transactions')
        .select('date:created_at::date, total_amount.sum()')
        .gte("created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
        .lte("created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
      if (!!error_by_date) throw error

      let { data: sum_by_method, error: error_by_method } = await supabase
        .from('sell_transactions')
        .select('payment_method, total_amount.sum()')
        .gte("created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
        .lte("created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
      if (!!error_by_method) throw error

      return {
        total: data[0].sum,
        date: sum_by_date,
        method: sum_by_method
      }
    }
  })
}

export const useSummaryTransactions = ( date ) => {
  const fromDate = date?.from ? new Date(date.from) : subDays(new Date(), 30)
  const toDate = date?.to ? new Date(date.to) : addDays(new Date(), 30)
  return useQuery({
    queryKey: [`sumTransactionsPayments${fromDate}${toDate}`],
    queryFn: async() => {
      let { data: total_transactions, error: error_total_transactions } = await supabase
        .from('transactions_payments')
        .select('amount.sum()')
        .gte("created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
        .lte("created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
      if (!!error_total_transactions) throw error_total_transactions

      let { data: total_sell_transactions, error: error_total_sell_transactions } = await supabase
        .from('sell_transactions')
        .select('total_amount.sum()')
        .gte("created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
        .lte("created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
      if (!!error_total_sell_transactions) throw error_total_sell_transactions

      let { data: sum_by_method, error: error_by_method } = await supabase
        .from('transactions_payments')
        .select('method, amount.sum()')
        .gte("created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
        .lte("created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
      if (!!error_by_method) throw error_by_method

      let { data: sum_by_method_sell, error: error_by_method_sell } = await supabase
        .from('sell_transactions')
        .select('method:payment_method, total_amount.sum()')
        .gte("created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
        .lte("created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
      if (!!error_by_method_sell) throw error_by_method_sell

      return {
        total_rent_transaction: total_transactions[0].sum,
        total_sell_transaction: total_sell_transactions[0].sum,
        rent_method: sum_by_method,
        sell_method: sum_by_method_sell,
      }
    }
  })
}

export const useChartData = ( date ) => {
  const fromDate = date?.from ? new Date(date.from) : subDays(new Date(), 30)
  const toDate = date?.to ? new Date(date.to) : addDays(new Date(), 30)
  return useQuery({
    queryKey: [`ChartTransactions${fromDate}${toDate}`],
    queryFn: async() => {
      let { data: sum_by_date, error: error_by_date } = await supabase
        .from('view_transactions_payments')
        .select('date:created_at_timezone::date, amount.sum()')
        .gte("created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
        .lte("created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
      if (!!error_by_date) throw error

       let { data: sum_sell_by_date, error: error_sell_by_date } = await supabase
        .from('view_sell_transactions')
        .select('date:created_at_timezone::date, total_amount.sum()')
        .gte("created_at", format(startOfDay(fromDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
        .lte("created_at", format(endOfDay(toDate), 'yyyy-MM-dd\'T\'HH:mm:ssXX'))
      if (!!error_sell_by_date) throw error

      const rent = createDateRangeWithValues(fromDate, toDate, sum_by_date)
      const sell = createDateRangeWithValues(fromDate, toDate, sum_sell_by_date)
      const sum = rent.map((item, index) => {
        const sellItem = sell[index]
        return {
          ...item,
          sum: item.sum + sellItem.sum
        }
      })

      return {
        sum: sum,
        rent: rent,
        sell: sell,
      }
    }
  })
}

export const useProductAnalysisData = ( date ) => {
  const fromDate = date?.from ? new Date(date.from) : subDays(new Date(), 30)
  const toDate = date?.to ? new Date(date.to) : addDays(new Date(), 30)
  return useQuery({
    queryKey: [`productAnalysisData${fromDate}${toDate}`],
    queryFn: async() => {
      let { data, error } = await supabase
        .rpc('get_total_rented', {
          fromdate: fromDate.toISOString(), 
          todate: toDate.toISOString()
        })
      if (error) console.error(error)
      else return data
    }
  })
}


export const insertTransactionsPayments = async(items) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('transactions_payments')
    .insert(items)
    .select()
  return { data, error }
}

export const updatedTransactionsPayments = async(item) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('transactions_payments')
    .update(item)
    .eq('id', item.id)
    .select()
  return { data, error }
}

export const deleteTransactionsPayments = async(transactionPaymentId) => {
  const supabase = await createClient()
  const { error } = await supabase
    .from('transactions_payments')
    .delete()
    .eq('id', transactionPaymentId)
  return { error }
}


export const useRentProductCatalogue = () => {
  return useQuery({
    queryKey: [`rentProductCatalogue`],
    queryFn: async() => {
      let { data, error } = await supabase
        .rpc('get_rent_catalogue')
      if (error) console.error(error)
      else return data
    }
  })
}

export const useSellProductCatalogue = () => {
  return useQuery({
    queryKey: [`sellProductCatalogue`],
    queryFn: async() => {
      let { data, error } = await supabase
        .rpc('get_sell_catalogue')
      if (error) console.error(error)
      else return data
    }
  })
}