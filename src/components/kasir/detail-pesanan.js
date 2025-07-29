import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"
import { Separator } from "../ui/separator"
import { Label } from "../ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input, InputNoBorder } from "../ui/input"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import Image from "next/image"
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react"
import { formatCurrency, formatToFloat } from "@/lib/utils"
import { useEffect, useState } from "react"
import { addTransaction } from "@/app/actions"
import { DateTimePicker } from "../date-time-picker"
import { addDays, differenceInDays, format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { NotaSewa } from "@/lib/nota-sewa"
import { pdf } from "@react-pdf/renderer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { fetchProductList } from "@/lib/data"

export const DetailPesanan = ({
  children,
  listItemOrder,
  setListItemOrder,
  handleDeleteItem,
  handleChangeQuantityInput,
  addItemQuantity,
  subtractItemQuantity,
  handleChangePrice,
  setListProduct,
  setHeaderInput
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [hariSewa, setHariSewa] = useState(1)
  const [tanggalPengambilan, setTanggalPengambilan] = useState(new Date())
  const [tanggalPengembalian, setTanggalPengembalian] = useState(addDays(new Date(), hariSewa))
  const [jaminan, setJaminan] = useState("")
  const [downPayment, setDownPayment] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [payments, setPayments] = useState([ { amount: 0, method: 'CASH', type: "Down Payment" } ])
  const [status, setStatus] = useState('Sewa')

  const handlePaymentAmountChange = (index, value) => {
    const newPayments = [...payments]
    let formattedValue = parseInt(value.replace(/[^0-9]/g, '') || 0);
    newPayments[index].amount = formattedValue
    setPayments(newPayments)
  }
  
  const handlePaymentMethodChange = (index, value) => {
    const newPayments = [...payments]
    newPayments[index].method = value
    setPayments(newPayments)
  }

  const handleAddPayments = () => {
    setPayments(prev => [ ...prev, { amount: 0, method: 'CASH', type: "Down Payment" } ])
  }
  const handleDeletePayments = (index) => {
    const newPayments = payments.filter((_, i) => i !== index);
    setPayments(newPayments);
  }

  const [totalAmount, setTotalAmount] = useState(listItemOrder.reduce((acc, obj) => acc + obj.price_at_transaction * obj.quantity * hariSewa, 0) - discount)
  let total = listItemOrder.reduce((acc, obj) => acc + obj.price_at_transaction * obj.quantity, 0)
  useEffect(() => setTotalAmount(listItemOrder.reduce((acc, obj) => acc + obj.price_at_transaction * obj.quantity * hariSewa, 0) - discount), [listItemOrder, discount, hariSewa])

  const rincianPembayaran = [
    {title: "Sub Total", value: formatCurrency(total)},
    {title: "Jumlah Hari", value: `X ${hariSewa}`},
    {title: "Diskon", value: formatCurrency(discount)},
    {title: "Total", value: formatCurrency(totalAmount), style: "font-medium"},
  ]

  const [isSendNota, setIsSendNota] = useState(true)
  const [pending, setPending] = useState(false)
  
  const onSubmit = async(e) => {
    e.preventDefault()
    setPending(true)
    const formData = new FormData(e.target)
    formData.set("tanggal_pengambilan", format(formData.get("tanggal_pengambilan"), "yyyy-MM-dd HH:mm:ss"))
    formData.set("tanggal_pengembalian", format(formData.get("tanggal_pengembalian"), "yyyy-MM-dd HH:mm:ss"))
    // formData.set("down_payment", downPayment)
    formData.set("discount", discount)
    formData.set("status", status)

    const response = await addTransaction(formData, listItemOrder, payments)
    console.log("Response", response)
    formData.set("down_payment", payments.reduce((acc, obj) => acc + obj.amount, 0))

    // Kirim Pesan Ke Whatsapp Tertuju
    if (!!isSendNota) {
      const pdfBlob = await pdf(<NotaSewa transaction={formData} listItemOrder={listItemOrder} rincian={rincianPembayaran} />).toBlob()
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });
      
      const responseSendWa = await fetch(`${process.env.NEXT_PUBLIC_WHATSAPP_CLIENT_URL}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.get("phone_number"),
          base64data: base64,
          message: "Send Media",
          filename: `Nota - ${formData.get("name")} - ${format(new Date(), "dd MMMM yyyy, HH:mm")}`,
        }),
      });
      if (responseSendWa.status === 200) {
        toast({
          title: "Send Nota Successful",
          description: `Nota telah berhasil dikirim ke nomor ${formData.get("phone_number")}`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Failed to send nota",
          description: "Gagal mengirim nota"
        })
      }
    }

    if (response.status === "success") {
      toast({
        title: "Add Transaction Successful",
        description: "Transaksi telah berhasil diproses",
      })
      setOpen(false)
      setListItemOrder([])
      setName("")
      setPhoneNumber("")
      setHariSewa(1)
      setTanggalPengambilan(new Date())
      setTanggalPengembalian(addDays(new Date(), hariSewa))
      setJaminan("")
      setPayments([ { amount: 0, method: 'CASH', type: "Down Payment" } ])
      // setDownPayment(0)
      setDiscount(0)
      // setPaymentMethod("CASH")

      fetchProductList(setListProduct, "")
      setHeaderInput("")
    } else {
      toast({
        variant: "destructive",
        title: "Gagal membuat transaksi",
        description: response.message
      })
    }

    setPending(false)
  }

  if (isDesktop) {
    return (
      <Dialog modal open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent
          position="right"
          size="xxxl"
        >
          <form onSubmit={onSubmit} className="max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Detail Pesanan</DialogTitle>
            </DialogHeader>
            <div className="flex flex-row gap-6 mt-6 flex-1 min-h-0 max-h-full">

              {/* Left Side */}
              <div className="w-1/2 flex flex-col gap-4 max-h-full">
                <div className="grid lg:grid-cols-2 gap-4">
                  <input
                    name="is_return"
                    value={false}
                    className="hidden"
                  />
                  <div className="grid w-full max-w-sm items-center gap-2">
                    <Label htmlFor="name">Nama Penyewa</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama"
                    />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-2">
                    <Label htmlFor="phone_number">No. Handphone</Label>
                    <Input
                      type="text"
                      id="phone_number"
                      name="phone_number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="hari_sewa">Hari Sewa</Label>
                    <Input
                      type="text"
                      id="hari_sewa"
                      name="hari_sewa"
                      value={hariSewa}
                      onChange={(e) => {
                        const value = parseFloat(formatToFloat(e.target.value) || 0)
                        setHariSewa(value)
                        setTanggalPengembalian(addDays(tanggalPengambilan, value))
                      }}
                    />
                  </div>
                  <div className="col-span-2 grid w-full max-w-sm items-center gap-2">
                    <Label htmlFor="tanggal_pengambilan">Tanggal Pengambilan</Label>
                    <Input
                      type="text"
                      id="tanggal_pengambilan"
                      value={tanggalPengambilan}
                      name="tanggal_pengambilan"
                      placeholder="Nama"
                      className="hidden"
                    />
                    <DateTimePicker
                      value={tanggalPengambilan}
                      onChange={(value) => {
                        setTanggalPengambilan(value)
                        setTanggalPengembalian(addDays(value, hariSewa))
                      }}
                    />
                  </div>
                  <div className="col-span-2 w-full max-w-sm items-center gap-2">
                    <Label htmlFor="tanggal_pengembalian">Tanggal Pengembalian</Label>
                    <Input
                      type="text"
                      id="tanggal_pengembalian"
                      value={tanggalPengembalian}
                      name="tanggal_pengembalian"
                      placeholder="08xxxxxxxxxx"
                      className="hidden"
                    />
                    <DateTimePicker
                      value={tanggalPengembalian}
                      onChange={(value) => {
                        setTanggalPengembalian(value)
                        setHariSewa(differenceInDays(value, tanggalPengambilan))
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="jaminan">Jaminan</Label>
                    <Input
                      type="text"
                      id="jaminan"
                      name="jaminan"
                      value={jaminan}
                      onChange={(e) => setJaminan(e.target.value)}
                      placeholder="KTP / SIM / KTM / NPWP"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount">Diskon</Label>
                    <Input
                      type="text"
                      id="discount"
                      name="discount"
                      value={formatCurrency(discount)}
                      onChange={(e) => {
                        let formattedValue = parseInt(e.target.value.replace(/[^0-9]/g, '') || 0);
                        setDiscount(formattedValue)
                      }}
                      placeholder="Diskon"
                    />
                  </div>
                  <Input
                    name="total_amount"
                    value={totalAmount}
                    className="hidden"
                  />
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sewa">Sewa</SelectItem>
                        <SelectItem value="Booking">Booking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4 mt-4 flex-1 min-h-0 max-h-full">
                  <div className="font-medium">Barang yang disewa</div>
                  <div className="flex flex-col overflow-y-auto max-h-full">
                  {listItemOrder.map((item, index) => (
                    <div key={item.id} className="flex flex-row gap-6 items-center">
                      <div className="relative w-[80px] h-[80px] rounded-lg">
                        <Image
                          src={item.product.image_url ? process.env.NEXT_PUBLIC_ENDPOINT_STORAGE + item.product.image_url : "/no-image-found.png"}
                          fill
                          className="object-cover"
                          alt={item.product.name || 'Product Image'}
                        />
                      </div>
                      <div className="w-full">
                        <div>{item.product.name}</div>
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
                </div>

              </div>

              <Separator orientation="vertical" />

              {/* Right Side */}
              <div className="w-1/2 h-full flex flex-col">
                <h2 className="font-medium text-">Rincian Pembayaran</h2>
                <div className="mt-4 space-y-1 text-">
                  {rincianPembayaran.map((item, index) => (
                    <div key={index} className={`flex justify-between ${item.style ? item.style : ''}`}>
                      <p>{item.title}</p>
                      <p>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <h2 className="font-medium mb-2">Pembayaran</h2>
                  <div className="flex flex-col gap-2">
                    {payments.map((item, index) => (
                      <div className="grid grid-cols-12 gap-2" key={index}>
                        <Input
                          type="text"
                          value={formatCurrency(item.amount)}
                          onChange={(e) => handlePaymentAmountChange(index, e.target.value)}
                          placeholder="Diskon"
                          className="col-span-6"
                        />
                        <div className="col-span-5">
                          <Select value={item.method} onValueChange={(value) => handlePaymentMethodChange(index, value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Metode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CASH">CASH</SelectItem>
                              <SelectItem value="QRIS">QRIS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button variant="icon" onClick={() => handleDeletePayments(index)}><TrashIcon color="red" /></Button>
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleAddPayments} variant="ghost" className="w-full mt-2"><PlusIcon /> Tambah</Button>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="font-medium text-lg">Note</p>
                  <Textarea
                    className="min-h-[100px]"
                    name="note"
                    placeholder="Masukkan Catatan ...."
                  />
                </div>
                <div className="mt-auto flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Checkbox id="is_send_nota" checked={isSendNota} onCheckedChange={setIsSendNota} />
                    <Label htmlFor="is_send_nota">Apakah ingin mengirim nota?</Label>
                  </div>
                  <Button
                    type="submit"
                    disabled={!listItemOrder.length > 0 || pending}
                    className="w-full"
                  >
                    {pending ? "Loading..." : "Selesaikan Pembayaran"}
                  </Button>
                </div>
                
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Detail Pesanan</DrawerTitle>
          </DrawerHeader>
        </div>
      </DrawerContent>
    </Drawer>
  )
}