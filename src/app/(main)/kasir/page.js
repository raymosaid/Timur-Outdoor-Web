'use client'

import { DetailPesanan } from "@/components/kasir/detail-pesanan";
import { DetailJual } from "@/components/kasir/detail-jual"
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { fetchProductList, fetchUserData } from "@/lib/data";
import { formatCurrency, formatToFloat } from "@/lib/utils";
import { ListFilter, MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { HeaderContext } from "../provider";
import { TooltipProduct } from "@/components/tooltip-product";


export default function Page() {
  const [isSelling, setIsSelling] = useState(false)
  const [listProduct, setListProduct] = useState([])
  const [displayProducts, setDisplayProducts] = useState([])
  const [listItemOrdered, setListItemOrdered] = useState([])
  const [sellListItemOrder, setSellListItemOrder] = useState([])
  const { headerInput, setHeaderInput } = useContext(HeaderContext)
  
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const PESANAN_WIDTH = "490px"

  useEffect(() => {
    fetchProductList(setListProduct, headerInput)
  }, [headerInput])
  useEffect(() => {
    if (!isSelling) {
      setDisplayProducts(listProduct.filter(d => d.rent_price > 0 && d.rent_price !== null))
    } else {
      setDisplayProducts(listProduct.filter(d => d.sell_price > 0 && d.sell_price !== null))
    }
  }, [listProduct, isSelling])

  const handleAddProduct = (product) => {
    const formatProduct = {
      product: product,
      quantity: 1,
      price_at_transaction: !isSelling ? product.rent_price : product.sell_price,
    }
    if (!isSelling) setListItemOrdered(prev => ([...prev, formatProduct]))
    if (!!isSelling) setSellListItemOrder(prev => ([...prev, formatProduct]))
  }

  const handleDeleteItem = (product) => {
    if (!isSelling) setListItemOrdered(prev => (prev.filter(d => d.product !== product.product)))
    if (!!isSelling) setSellListItemOrder(prev => (prev.filter(d => d.product !== product.product)))
  }

  const addItemQuantity = (item, index) => {
    if (!isSelling) {
      const newItems = listItemOrdered.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            quantity: item.quantity + 1
          }
        } else {
          return c
        }
      })
      setListItemOrdered(newItems)
    } else {
      const newItems = sellListItemOrder.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            quantity: item.quantity + 1
          }
        } else {
          return c
        }
      })
      setSellListItemOrder(newItems)
    }
  }

  const subtractItemQuantity = (item, index) => {
    if (!isSelling) {
      const newItems = listItemOrdered.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            quantity: item.quantity - 1
          }
        } else {
          return c
        }
      })
      setListItemOrdered(newItems)
    } else {
      const newItems = sellListItemOrder.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            quantity: item.quantity - 1
          }
        } else {
          return c
        }
      })
      setSellListItemOrder(newItems)
    }
  }

  const handleChangeQuantityInput = (item, input, index) => {
    let formattedValue = parseInt(input.replace(/\D/g, ''));
    formattedValue = formattedValue > item.product.stock_quantity ? item.product.stock_quantity : formattedValue
    formattedValue = formattedValue < 1 ? 1 : formattedValue
    formattedValue = !formattedValue ? 0 : formattedValue
    if (!isSelling) {
      const newItems = listItemOrdered.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            quantity: formattedValue
          }
        } else {
          return c
        }
      })
      setListItemOrdered(newItems)
    } else {
      const newItems = sellListItemOrder.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            quantity: formattedValue
          }
        } else {
          return c
        }
      })
      setSellListItemOrder(newItems)
    }
  }

  const handleChangePrice = (item, input, index) => {
    let formattedValue = parseInt(input.replace(/[^0-9]/g, '') || 0);
    if (!isSelling) {
      const newItems = listItemOrdered.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            price_at_transaction: formattedValue
          }
        } else {
          return c
        }
      })
      setListItemOrdered(newItems)
    } else {
      const newItems = sellListItemOrder.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            price_at_transaction: formattedValue
          }
        } else {
          return c
        }
      })
      setSellListItemOrder(newItems)
    }
  }

  // Add Event Listeners
  useEffect(() => {
    const handleKeyPress = (event) => {
      const tagName = document.activeElement.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea') return;
      if (/^[a-zA-Z]$/.test(event.key)) {
        setHeaderInput((prev) => (prev + event.key))
      } else if (event.key === 'Backspace') {
        setHeaderInput((prev) => prev.slice(0, -1));
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [])

  return (
    <>
      <div className="flex flex-row justify-between max-h-[calc(100vh-100px)]">

        {/* List Item */}
        <div className="flex flex-col m-[30px] gap-[25px] w-full">
          <div className="flex justify-between">
            <p className="text-2xl font-semibold">List Product</p>
            <div>
              <Button variant={!!isSelling ? "outline" : ""} className={`rounded-none rounded-l-lg`} onClick={() => setIsSelling(false)}>Sewa</Button>
              <Button variant={!!isSelling ? "" : "outline"}  className={`rounded-none rounded-r-lg`} onClick={() => setIsSelling(true)}>Jual</Button>
            </div>
          </div>
          {/* Items */}
          <div className="grid sm:grid-cols- md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4 overflow-y-auto">
            {displayProducts.map((item, index) => (
              <div key={index} className="flex flex-row sm:flex-col border rounded-lg border-primary/10 bg-white shadow-lg p-6 gap-4">
                <div className="relative w-full aspect-[1/1] rounded-lg">
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
                  <p className="break-words">
                    {!!isSelling ? `Harga: ${formatCurrency(item.sell_price)}` : `Harga: ${formatCurrency(item.rent_price)}/Hari`}
                  </p>
                </div>
                <div className="flex items-center w-full gap-3 mt-auto">
                  <Button
                    className="w-full"
                    // disabled={listItemOrdered.find(d => d.product.id === item.id) || item.tersedia <= 0}
                    disabled={listItemOrdered.find(d => d.product.id === item.id)}
                    onClick={() => {
                      handleAddProduct(item)
                      setHeaderInput("")
                    }}
                  >
                    Tambah
                  </Button>
                  <TooltipProduct product={item} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pesanan */}
        {!isSelling ? (
          <div className={`flex flex-col 2xl:min-w-[485px] xl:min-w-[500px] bg-white p-[30px] min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)]`}>
            <div className="flex flex-col gap-8 h-full max-h-full">
              <div className="text-2xl font-semibold">Pesanan Sewa</div>
              <div className="flex flex-col gap-[30px] overflow-auto h-full max-h-full">
                {!!listItemOrdered && listItemOrdered.length > 0 && listItemOrdered.map((item, index) => (
                  <div key={index} className="flex flex-row gap-6 items-center">
                    <div className="relative w-[100px] h-[80px] rounded-lg">
                      <Image
                        src={item.product.image_url ? process.env.NEXT_PUBLIC_ENDPOINT_STORAGE + item.product.image_url : "/no-image-found.png"}
                        fill
                        className="object-cover"
                        alt={item.product.name || 'Product Image'}
                      />
                    </div>
                    <div className="w-full">
                      <div>{item.product.name}</div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <button
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
              {/* Footer */}
              <div className="grid grid-cols-3 gap-4 mt-auto">
                <Button
                  variant="outline"
                  className="col-span-1"
                  onClick={() => setListItemOrdered([])}
                >
                  Batal
                </Button>
                <DetailPesanan
                  listItemOrder={listItemOrdered}
                  setListItemOrder={setListItemOrdered}
                  handleDeleteItem={handleDeleteItem}
                  handleChangeQuantityInput={handleChangeQuantityInput}
                  addItemQuantity={addItemQuantity}
                  subtractItemQuantity={subtractItemQuantity}
                  handleChangePrice={handleChangePrice}
                  setListProduct={setListProduct}
                  setHeaderInput={setHeaderInput}
                >
                  <Button className="col-span-2">Lanjutkan Pemesanan</Button>
                </DetailPesanan>
              </div>
            </div>
          </div>
        ) : (
          <div className={`flex flex-col 2xl:min-w-[485px] xl:min-w-[500px] bg-white p-[30px] min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)]`}>
            <div className="flex flex-col gap-8 h-full max-h-full">
              <div className="text-2xl font-semibold">Pesanan Jual</div>
              <div className="flex flex-col gap-[30px] overflow-auto h-full max-h-full">
                {!!sellListItemOrder && sellListItemOrder.length > 0 && sellListItemOrder.map((item, index) => (
                  <div key={index} className="flex flex-row gap-6 items-center">
                    <div className="relative w-[100px] h-[80px] rounded-lg">
                      <Image
                        src={item.product.image_url ? process.env.NEXT_PUBLIC_ENDPOINT_STORAGE + item.product.image_url : "/no-image-found.png"}
                        fill
                        className="object-cover"
                        alt={item.product.name || 'Product Image'}
                      />
                    </div>
                    <div className="w-full">
                      <div>{item.product.name}</div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <button
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
              {/* Footer */}
              <div className="grid grid-cols-3 gap-4 mt-auto">
                <Button
                  variant="outline"
                  className="col-span-1"
                  onClick={() => setListItemOrdered([])}
                >
                  Batal
                </Button>
                <DetailJual
                  listItemOrder={sellListItemOrder}
                  setListItemOrder={setSellListItemOrder}
                  handleDeleteItem={handleDeleteItem}
                  handleChangeQuantityInput={handleChangeQuantityInput}
                  addItemQuantity={addItemQuantity}
                  subtractItemQuantity={subtractItemQuantity}
                  handleChangePrice={handleChangePrice}
                  setListProduct={setListProduct}
                  setHeaderInput={setHeaderInput}
                >
                  <Button className="col-span-2">Lanjutkan Pemesanan</Button>
                </DetailJual>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}