import { TooltipProduct } from "@/components/tooltip-product"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input, InputNoBorder } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { deleteTransactionItem, editTransactionDetail, fetchProductList, insertTransactionItem, updateTransactionItem } from "@/lib/data"
import { arraysEqualDeep, formatCurrency } from "@/lib/utils"
import { MinusIcon, Pencil, PlusIcon, TrashIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export const EditItems = ({ transaction, setTransaction }) => {
  const [listItems, setListItems] = useState(transaction.transaction_items)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [listItemOrder, setListItemOrder] = useState(transaction.transaction_items)
  const [searchProducts, setSearchProducts] = useState("")
  const [listProduct, setListProduct] = useState(null)
  // console.log(listItemOrder, listItems)
  const { toast } = useToast()
  
  useEffect(() => {
    fetchProductList(setListProduct, searchProducts)
  }, [searchProducts])

  useEffect(() => {
    setListItems(transaction.transaction_items)
    setListItemOrder(transaction.transaction_items)
  }, [transaction])

  const handleAddProduct = (product) => {
    const formatProduct = {
      product: product,
      quantity: 1,
      price_at_transaction: product.rent_price,
    }
    setListItemOrder(prev => ([...prev, formatProduct]))
  }

  const handleDeleteItem = (product) => {
    setListItemOrder(prev => (prev.filter(d => d.product !== product.product)))
  }

  const addItemQuantity = (item, index) => {
    const newItems = listItemOrder.map((c, i) => {
      if (i === index) {
        return {
          ...c,
          quantity: item.quantity + 1
        }
      } else {
        return c
      }
    })
    setListItemOrder(newItems)
  }

  const subtractItemQuantity = (item, index) => {
    const newItems = listItemOrder.map((c, i) => {
      if (i === index) {
        return {
          ...c,
          quantity: item.quantity - 1
        }
      } else {
        return c
      }
    })
    setListItemOrder(newItems)
  }

  const handleChangeQuantityInput = (item, input, index) => {
    let formattedValue = parseInt(input.replace(/\D/g, ''));
    formattedValue = formattedValue > item.product.stock_quantity ? item.product.stock_quantity : formattedValue
    formattedValue = formattedValue < 1 ? 1 : formattedValue
    formattedValue = !formattedValue ? 0 : formattedValue
    const newItems = listItemOrder.map((c, i) => {
      if (i === index) {
        return {
          ...c,
          quantity: formattedValue
        }
      } else {
        return c
      }
    })
    setListItemOrder(newItems) 
  }

  const handleChangePrice = (item, input, index) => {
    let formattedValue = parseInt(input.replace(/[^0-9]/g, '') || 0);
    const newItems = listItemOrder.map((c, i) => {
      if (i === index) {
        return {
          ...c,
          price_at_transaction: formattedValue
        }
      } else {
        return c
      }
    })
    setListItemOrder(newItems) 
  }

  const [pending, setPending] = useState(false)
  const saveChanges = async() => {
    const updatedItems = listItemOrder.filter(a => 
      listItems.some(b => b.product.id === a.product.id)
    )
    const insertedItems = listItemOrder.filter(a =>
      !listItems.some(b => b.product.id === a.product.id)
    )
    const deletedItems = listItems.filter(b =>
      !listItemOrder.some(a => a.product.id === b.product.id)
    )

    const response = await Promise.all(
      updatedItems.map(item => {
        const itemUpdate = item
        const transactionItemId = item.id
        delete itemUpdate.product
        delete itemUpdate.id
        delete itemUpdate.transaction_id
        delete itemUpdate.product_id
        updateTransactionItem(transactionItemId, itemUpdate)
      }),
      insertedItems.map(item => {
        const itemInsert = item
        itemInsert.product_id = item.product.id
        itemInsert.transaction_id = transaction.id
        delete itemInsert.product
        insertTransactionItem(itemInsert)
      }),
      deletedItems.map(item => {
        deleteTransactionItem(item.id)
      })
    )

    const totalAmount = listItemOrder.reduce((acc, obj) => acc + obj.price_at_transaction * obj.quantity * transaction.hari_sewa, 0) - transaction.discount
    
    const { data, error } = await editTransactionDetail(transaction.id, {total_amount: totalAmount})
    // console.log("data", data)
    // // setTransaction(data[0])
    // // setListItemOrder(data[0].transaction_items)
    if (!error) {
      toast({
        title: "Update Transaction Successful",
        description: "Transaksi telah berhasil diupdate",
      })
      window.location.reload()
    } else {
      toast({
        variant: "destructive",
        title: "Gagal mengupdate transaksi",
        description: error
      })
    }
    setPending(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Pencil /> Edit Item
        </Button>
      </DialogTrigger>
      <DialogContent
        size="full"
        className="flex flex-col gap-0"
      >
        <DialogHeader>
          <DialogTitle>Edit Product Items</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row gap-6 mt-6 flex-1 min-h-0 max-h-full">
          {/* List Products */}
          <div className="w-7/12">
            <p className="text-lg font-semibold">List Products</p>
            <Input
              value={searchProducts}
              onChange={(e) => setSearchProducts(e.target.value)}
              placeholder="Search Products"
              className="my-4"
            />
            <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[80vh]">
              {!!listProduct && listProduct.map((item, index) => (
                <div key={index} className="flex flex-row sm:flex-col border rounded-lg border-primary/10 bg-white shadow-md p-6 gap-4">
                  <div className="relative w-full aspect-[1/1] border rounded-lg">
                    <Image
                      src={item.image_url ? process.env.NEXT_PUBLIC_ENDPOINT_STORAGE + item.image_url : "/no-image-found.png"}
                      fill
                      alt={item.name}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="break-words font-medium text-lg">{item.name}</p>
                    <p className="truncate">Tersedia: {item.tersedia}</p>
                    <p className="break-words">Harga: {formatCurrency(item.rent_price)}/Hari</p>
                  </div>
                  <div className="flex items-center w-full gap-3 mt-auto">
                    <Button
                      className="w-full"
                      // disabled={listItemOrder.find(d => d.product.id === item.id) || item.tersedia <= 0}
                      disabled={listItemOrder.find(d => d?.product?.id === item?.id)}
                      onClick={() => handleAddProduct(item)}
                    >
                      Tambah
                    </Button>
                    <TooltipProduct product={item} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* List Item Pesanan */}
          <div className="w-5/12 flex flex-col">
            <p className="text-lg font-semibold mb-4">Item Pesanan</p>
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
              {!!listItemOrder && listItemOrder.map((item, index) => (
                <div key={item.id} className="flex flex-row gap-6 items-center">
                  <div className="relative w-[80px] h-[80px] rounded-lg">
                    <Image
                      src={item.product?.image_url ? process.env.NEXT_PUBLIC_ENDPOINT_STORAGE + item.product?.image_url : "/no-image-found.png"}
                      fill
                      className="object-cover"
                      alt={item.product?.name || 'Product Image'}
                    />
                  </div>
                  <div className="w-full">
                    <div>{item.product?.name}</div>
                    <div className="flex items-center">
                      <div>Harga</div>
                      <InputNoBorder
                        value={formatCurrency(item.price_at_transaction)}
                        onChange={(e) => handleChangePrice(item, e.target.value, index)}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item)}
                        >
                          <TrashIcon size={20} color="red" />
                        </button>
                        <div className="flex items-center bg-gray-100 rounded-full space-x-1 w-fit p-1">
                          <Button
                            className="rounded-full"
                            variant="outline"
                            size="smallIcon"
                            disabled={item.quantity <= 1}
                            onClick={() => subtractItemQuantity(item, index)}
                          >
                            <MinusIcon />
                          </Button>
                          <input
                            type="text"
                            value={item.quantity}
                            onChange={(e) => handleChangeQuantityInput(item, e.target.value, index)}
                            placeholder="Quantity"
                            className="w-[40px] text-center bg-transparent"
                          />
                          <Button
                            className="rounded-full"
                            variant="outline"
                            size="smallIcon"
                            // disabled={item.quantity >= item.product.stock_quantity}
                            onClick={() => addItemQuantity(item, index)}
                          >
                            <PlusIcon />
                          </Button>
                        </div>
                      </div>
                      <div>{formatCurrency(item.price_at_transaction * item.quantity)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-auto" onClick={saveChanges} disabled={arraysEqualDeep(listItems, listItemOrder) || !!pending || !listItemOrder.length > 0}>{!!pending ? "Loading..." : "Save Changes"}</Button>
          </div>
        
        </div>
      </DialogContent>
    </Dialog>
  )
}