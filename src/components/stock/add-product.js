import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useContext, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { getImageData } from "@/lib/utils";
import { addProduct } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { HeaderContext } from "@/app/(main)/provider";


const listInputAddProduct = [
  {name: "name", title: "Nama Produk", type: "text", placeholder: "Nama Produk", defaultValue: "", required: true},
  {name: "rent_price", title: "Harga Sewa", type: "number", placeholder: "20000", defaultValue: 0, required: true},
  {name: "sell_price", title: "Harga Jual", type: "number", placeholder: "20000", defaultValue: 0, required: true},
  {name: "jumlah_barang", title: "Jumlah Barang", type: "number", placeholder: "0 pcs", defaultValue: 0, required: true},
]

export default function AddProductDialogue({ children, setListProduct }) {
  const [pending, setPending] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [open, setOpen] = useState(false)
  const { setHeaderInput } = useContext(HeaderContext)
  const { toast } = useToast()

  const onSubmit = async(e) => {
    e.preventDefault()
    setPending(true)
    const formData = new FormData(e.target)
    const response = await addProduct(formData)
    if (response.status === "success") {
      toast({
        title: "Add Product Successful",
        description: "Berhasil menambahkan produk",
      })
      setListProduct(prev => ([...prev, response.data]))
      setImagePreview(null)
      setOpen(false)
    } else {
      toast({
        variant: "destructive",
        title: "Gagal menambahkan produk",
        description: response.message.message
      })
    }
    setHeaderInput("")
    setPending(false)
  }

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent size="xxl">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Produk Baru</DialogTitle>
            <DialogDescription>Menambahkan produk yang belum ditambahkan</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <div className="relative w-32 h-32">
              <Image
                fill
                src={imagePreview ? imagePreview : "/fe_picture.png"}
                alt={"test"}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col gap-2 w-fit">
              <Label>Tambah Foto</Label>
              <Input
                type="file"
                id="product_image"
                name="product_image"
                onChange={(event) => {
                  const { displayUrl} = getImageData(event)
                  setImagePreview(displayUrl);
                }}
              />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {listInputAddProduct.map((item, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <Label>{item.title}</Label>
                  <Input
                    id={item.name}
                    name={item.name}
                    type={item.type}
                    placeholder={item.placeholder}
                    required={item.required}
                    onInvalid={(e) => {
                      if (item.name === "rent_price") e.target.setCustomValidity("Silahkan isi dengan 0 jika bukan barang sewa");
                      if (item.name === "sell_price") e.target.setCustomValidity("Silahkan isi dengan 0 jika bukan barang jual");
                    }}
                    onInput={(e) => e.target.setCustomValidity("")}
                  />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className={"sm:justify-start mt-8"}>
            <Button type="submit" disabled={!!pending}>{!!pending ? "Loading...": "Tambah Produk"}</Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}