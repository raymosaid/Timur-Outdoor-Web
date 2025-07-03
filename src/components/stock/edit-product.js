import Image from "next/image"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { formatCurrency, getImageData } from "@/lib/utils"
import { useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { updateProduct } from "@/lib/data"
import { createClient } from "@/utils/supabase/client"

export const EditProduct = ({ product }) => {
  const { toast } = useToast()
  const [pending, setPending] = useState(false)

  const imageInputRef = useRef()
  const [imagePreview, setImagePreview] = useState(null)

  const [name, setName] = useState(product.name)
  const [category, setCategory] = useState(product.category)
  const [rentPrice, setRentPrice] = useState(product.rent_price)
  const [sellPrice, setSellPrice] = useState(product.sellPrice)
  const [jumlahBarang, setJumlahBarang] = useState(product.jumlah_barang)
  const [barangTersedia, setBarangTersedia] = useState(product.barang_tersedia)
  
  const listInputEditProduct = [
    {name: "name", title: "Nama Produk", type: "text", placeholder: "Nama Produk", defaultValue: product.name, value: name, setState: setName},
    {name: "category", title: "Kategori", type: "text", placeholder: "Kategori", defaultValue: product.category, value: category, setState: setCategory},
    {name: "rent_price", title: "Harga Sewa", type: "number", placeholder: formatCurrency(20000), defaultValue: product.rent_price, value: rentPrice, setState: setRentPrice},
    {name: "sell_price", title: "Harga Jual", type: "number", placeholder: formatCurrency(20000), defaultValue: product.sellPrice, value: sellPrice, setState: setSellPrice},
    {name: "jumlah_barang", title: "Jumlah Barang", type: "number", placeholder: "Jumlah Barang", defaultValue: product.jumlah_barang, value: jumlahBarang, setState: setJumlahBarang},
  ]

  const onSubmit = async(e) => {
    e.preventDefault()
    setPending(true)

    const formData = new FormData(e.target)
    const supabase = await createClient();

    if (!!imagePreview) {
      const productImage = formData.get("product_image");
      const { data: dataInsertStorage, error: errorInsertStorage } = await supabase
        .storage
        .from('timur')
        .upload(`product/${crypto.randomUUID()}_${productImage?.name}`, productImage, {
          cacheControl: '3600',
          upsert: false
        })
      formData.set("image_url", dataInsertStorage?.path)
    }
    formData.delete("product_image")

    const patchData = {}
    for (const key in Object.fromEntries(formData.entries())) {
      let defaultValue = formData.get(key)
      if (key === 'rent_price') defaultValue = rentPrice
      if (key === 'sell_price') defaultValue = sellPrice
      if (key === 'jumlah_barang') defaultValue = jumlahBarang
      if (key === 'barang_tersedia') defaultValue = barangTersedia

      if (defaultValue !== product[key]) {
        // if (key === "product_image" && (formData.get(key).size == 0 || !formData.get(key).name)) {
        //   console.log("No Update Image")
        // } else {
          patchData[key] = defaultValue
        // }
      }
    }

    const { data, error } = await updateProduct(patchData, product)
    console.log("Data Update", data)
    if (!error) {
      toast({
        title: "Edit Product Successful",
        description: "Produk telah berhasil diubah",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Failed To Update Product",
        description: "Produk gagal diupdate"
      })
    }
    setPending(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Edit</Button>
      </DialogTrigger>
      <DialogContent size={'xxxl'}>
        <form onSubmit={onSubmit}>
        <DialogHeader>
          <DialogTitle>Edit Barang</DialogTitle>
        </DialogHeader>
        <div className="my-6">
          <div className="flex items-end space-x-6 mb-4">
            <div className="relative aspect-[1/1] rounded-lg w-[216px] group overflow-hidden cursor-pointer" onClick={() => imageInputRef.current.click()}>
              <p className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">Change Image</p>
              <Input
                type="file"
                id="product_image"
                name="product_image"
                ref={imageInputRef}
                onChange={(event) => {
                  const { displayUrl} = getImageData(event)
                  setImagePreview(displayUrl);
                }}
                className="hidden"
              />
              <Image
                src={imagePreview ? imagePreview : product.image_url ? process.env.NEXT_PUBLIC_ENDPOINT_STORAGE + product.image_url : '/no-image-found.png'}
                fill
                className="object-cover hover:bg-gray-300 hover:bg-blend-darken rounded-lg"
                alt={product.name || 'Product Image'}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {listInputEditProduct.map((item, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Label>{item.title}</Label>
                <Input
                  id={item.name}
                  name={item.name}
                  display={(item.name === "rent_price" || item.name === "sell_price") ? formatCurrency(item.value) : item.value}
                  defaultValue={item.defaultValue}
                  placeholder={item.placeholder}
                  value={(item.name === "rent_price" || item.name === "sell_price") ? formatCurrency(item.value) : item.value}
                  onChange={(e) => {
                    let formattedValue = e.target.value
                    if (item.type === 'number') {
                      formattedValue = parseInt(e.target.value.replace(/\D/g, ''))
                    }
                    if (item.type === 'number' && !e.target.value) formattedValue = 0
                    item.setState(formattedValue)
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          {/* <DialogClose>
            <Button>Cancel</Button>
          </DialogClose> */}
          <DialogClose>
            <Button type="submit" disabled={pending}>{!pending ? "Simpan Perubahan" : "Menyimpan..."}</Button>
          </DialogClose>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}