'use client'

import { useContext, useEffect, useState } from "react"
import { HeaderContext } from "../provider"
import { fetchProductsMaintenance, subProductMaintenance } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image"
import { Info, MinusIcon, PlusIcon } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"


export default function Page() {
  const { headerInput } = useContext(HeaderContext)
  const [items, setItems] = useState(null)

  useEffect(() => {
    const fetchItems = async() => {
      const { data, error } = await fetchProductsMaintenance(headerInput)
      if (!error) setItems(data)
    }
    fetchItems()
  }, [headerInput])

  console.log(items)

  return (
    <div className="m-[30px] flex flex-col max-h-[calc(100vh-100px-60px)]">
      {/* <p className="text-2xl font-semibold mb-4">List Maintenance Barang</p> */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] max-h-full overflow-y-auto">
        {!!items ? items.map((item, index) => (
          <div key={index} className="border border-primary/10 shadow-lg bg-white p-6 rounded-lg flex flex-col gap-4">
            <div className="relative aspect-[1/1] rounded-lg">
              <Image
                src={item.image_url ? process.env.NEXT_PUBLIC_ENDPOINT_STORAGE + item.image_url : "/no-image-found.png"}
                fill
                className="object-cover rounded-sm"
                alt={item.name || 'Product Image'}
              />
            </div>
            <div className="break-all">
              <p className="font-medium">{item.name}</p>
              <p className="">Maintenance: {item.barang_maintenance}</p>
              {/* <p>Jumlah Barang: {item.jumlah_barang}</p> */}
            </div>
            <div className="flex w-full items-center gap-2">
              <DialogEditMaintenance product={item} items={items} setItems={setItems}>
                <Button className="break-all w-full">Edit</Button>
              </DialogEditMaintenance>
              <ProductTooltip product={item} />
            </div>
          </div>
        )) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  )
}


const DialogEditMaintenance = ({ children, product, items, setItems }) => {
  const [open, setOpen] = useState(false)
  const [quantityFinish, setQuantityFinish] = useState(0)
  const { setHeaderInput } = useContext(HeaderContext)

  const { toast } = useToast()

  const handleChangeQuantityInput = (input) => {
    let formattedValue = parseInt(input.replace(/\D/g, ''));
    formattedValue = formattedValue > product.barang_maintenance ? product.barang_maintenance : formattedValue
    formattedValue = formattedValue < 0 ? 0 : formattedValue
    formattedValue = !formattedValue ? 0 : formattedValue
    setQuantityFinish(formattedValue)
  }

  const onSubmit = async() => {
    const { error } = await subProductMaintenance(product, quantityFinish)
    if (!error) {
      toast({
        title: "Update Maintenance Successful",
        description: "Jumlah barang maintenance telah berhasil diproses",
      })
      setOpen(prev => (!prev))
      let updated = items.map(item => {
        if (item.id !== product.id) return item
        return {
          ...item,
          barang_maintenance: item.barang_maintenance - quantityFinish
        }
      }).filter(item => item.barang_maintenance > 0)
      setItems(updated)
      setHeaderInput("")
    } else {
      toast({
        variant: "destructive",
        title: "Failed Update Maintenance",
        description: "Gagal mengupdate jumlah barang maintenance"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selesai Maintenance</DialogTitle>
        </DialogHeader>

        <div className="py-4 text-lg flex flex-col gap-2">
          <div className="flex items-center gap-4"><span>Barang Maintenance</span><span className="font-medium text-2xl text-blue-800">{product.barang_maintenance - quantityFinish}</span></div>
          <div className="flex items-center gap-4">
            <p>Selesai Maintenance</p>
            <div className="flex items-center bg-gray-100 rounded-full space-x-1 w-fit p-1">
              <Button
                className="rounded-full"
                variant="outline"
                size="smallIcon"
                disabled={quantityFinish <= 0}
                onClick={() => setQuantityFinish(prev => (prev - 1))}
              >
                <MinusIcon />
              </Button>
              <input
                type="text"
                value={quantityFinish}
                onChange={(e) => handleChangeQuantityInput(e.target.value)}
                placeholder="Quantity"
                className="w-[40px] text-center bg-transparent text-xl"
              />
              <Button
                className="rounded-full"
                variant="outline"
                size="smallIcon"
                disabled={quantityFinish >= product.barang_maintenance}
                onClick={() => setQuantityFinish(prev => (prev + 1))}
              >
                <PlusIcon />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={quantityFinish <= 0}
            onClick={onSubmit}
          >Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const ProductTooltip = ({ product }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="text-primary">
          <Info size={36}  />
        </button>
      </TooltipTrigger>
      <TooltipContent className="p-4 space-y-2">
        <div className="text-lg font-semibold break-all max-w-xs">{product.name}</div>
        <div className="text-sm">
          <p>Sisa: </p>
          <p>Dicuci: </p>
          <p>Rusak: </p>
          <p>Disewa: </p>
          <p>Total Barang: </p>
          <p>Harga: </p>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)