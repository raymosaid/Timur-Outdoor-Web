'use client'

import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import AddProductDialogue from "@/components/stock/add-product"
import { CardProduct } from "@/components/stock/card-product"
import { fetchProductList, fetchUserData } from "@/lib/data";
import { HeaderContext } from "../provider";

export default function Page() {
  const [listProduct, setListProduct] = useState([])
  const { headerInput, setHeaderInput } = useContext(HeaderContext)
  
  useEffect(() => {
    fetchProductList(setListProduct, headerInput)
  }, [headerInput])


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
      <div className="m-[30px] space-y-[25px] flex flex-col max-h-[calc(100vh-160px)]">
        <div className="flex gap-4">
          <AddProductDialogue
            setListProduct={setListProduct}
          >
            <Button>Tambah Produk Baru</Button>
          </AddProductDialogue>
          <Button>Tambah Produk Lama</Button>
        </div>
        {/* <div className="flex flex-wrap gap-6"> */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 max-h-full overflow-y-auto">
          {listProduct.length > 0 && listProduct.map(item  => (
            <CardProduct key={item.id} product={item} />
          ))}
        </div>
      </div>
    </>
  )
}