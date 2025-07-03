import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/utils";
import { Info } from "lucide-react";

export const TooltipProduct = ({ product }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="text-gray-700">
          <Info size={36}  />
        </button>
      </TooltipTrigger>
      <TooltipContent className="p-4 space-y-2">
        <div className="text-lg font-semibold">{product.name}</div>
        <div className="text-sm">
          <p>Stok: {product.jumlah_barang}</p>
          <p>Maintenance: {product.barang_maintenance}</p>
          <p>Disewa: {product.total_rented}</p>
          <p>Tersedia: {product.tersedia}</p>
          <p>Harga: {formatCurrency(product.rent_price)}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)