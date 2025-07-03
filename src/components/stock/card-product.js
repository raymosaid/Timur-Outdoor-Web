import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { EditProduct } from "@/components/stock/edit-product"
import { TooltipProduct } from "@/components/tooltip-product"

const CardProduct = ({ product }) => {
  return (
    <div className="border border-primary/10 shadow-lg bg-white p-6 rounded-lg flex flex-col gap-4">
      <div className="relative aspect-[1/1] rounded-lg">
        <Image
          src={product.image_url ? process.env.NEXT_PUBLIC_ENDPOINT_STORAGE + product.image_url : '/no-image-found.png'}
          fill
          className="object-cover"
          alt={product.name || 'Product Image'}
        />
      </div>
      <div className="">
        <p className="font-medium">{product.name}</p>
        <p>Stok: {product.jumlah_barang}</p>
        <p>Maintenance: {product.barang_maintenance}</p>
        <p>Disewa: {product.total_rented}</p>
        <p>Tersedia: {product.tersedia}</p>
        <p>Harga: {formatCurrency(product.rent_price)} / Hari</p>
      </div>
      <div className="flex w-full items-center gap-2 mt-auto">
        <EditProduct product={product} />
        <TooltipProduct product={product} />
      </div>
    </div>
  )
}

export { CardProduct }