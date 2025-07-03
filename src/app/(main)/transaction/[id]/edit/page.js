'use client'

import { HeaderContext } from "@/app/(main)/provider"
import { Input } from "@/components/ui/input"
import { fetchDetailTransaction } from "@/lib/data"
import { useParams } from "next/navigation"
import { useCallback, useContext, useEffect, useState } from "react"

export default function Page() {
  const pathname = useParams()
  const transactionId = pathname.id

  const { headerInput, setHeaderInput } = useContext(HeaderContext)
  const [transaction, setTransaction] = useState(null)
  const [listProduct, setListProduct] = useState(null)

  useEffect(() => {
    fetchProductList(setListProduct, headerInput)
  }, [headerInput])

  const fetchTransaction = useCallback(() => {
    fetchDetailTransaction(transactionId, setTransaction)
  }, [])

  useEffect(() => {
    fetchTransaction()
  }, [])

  return (
    <div className="flex flex-row gap-6 mt-6 flex-1 min-h-0 max-h-full">
      {/* List Products */}
      <div className="w-7/12">
        {/* <p className="text-lg font-semibold">List Products</p>
        <Input
          value={heade}
          onChange={(e) => setSearchProducts(e.target.value)}
          placeholder="Search Products"
          className="my-4"
        /> */}
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
        <Button className="mt-auto" onClick={saveChanges}>Save Changes</Button>
      </div>
    
    </div>
  )
}