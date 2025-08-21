'use client'

import { Header } from "@/components/front/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { fetchProductList, useRentProductCatalogue, useSellProductCatalogue } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Search } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

export default function Page() {
  const { data: rentProducts, isLoading: loadingRents } = useRentProductCatalogue()
  const { data: sellProducts, isLoading: loadingSell } = useSellProductCatalogue()
  console.log(rentProducts, sellProducts)
  const [products, setProducts] = useState(null)
  const [category, setCategory] = useState('')
  const [type, setType] = useState('sewa')

  const [rentItemOrder, setRentItemOrder] = useState([])
  const [sellItemOrder, setSellItemOrder] = useState([])
  // console.log(rentItemOrder, sellItemOrder)

  useEffect(() => {
    fetchProductList(setProducts, '')
  }, [])

  const [showProducts, setShowProducts] = useState(null)
  useEffect(() => {
    if (!!products) {
      if (type === 'sewa') {
        setShowProducts(products.filter(product => product.rent_price > 0))
      } else {
        setShowProducts(products.filter(product => product.sell_price > 0))
      }
    }
  }, [products, type])
  
  const categories = [
    { label: 'All', value: '' },
    { label: 'Camping', value: 'camping' },
    { label: 'Alat Masak', value: 'masak' },
    { label: 'Penerangan', value: 'penerangan' },
  ]

  const types = [
    { label: "Sewa", value: 'sewa' },
    { label: "Jual", value: 'jual' }
  ]

  return (
    <>
      <Header />
      <div className="px-5 py-16 pt-0 mx-auto items-center md:max-w-4xl">

        {/* Type Transaction */}
        <div className="sticky top-0 pt-24 flex items-center justify-center z-50">
          <div className="flex items-center rounded rounded-full bg-white border shadow-2xl border-primary w-fit p-1 gap-1 max-w-2xs overflow-auto">
            {types.map((item, index) => (
              <Fragment key={index}>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setType(item.value)}
                  className={`rounded rounded-full ease-in-out ${type === item.value && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'} ${type !== item.value && 'hover:bg-primary hover:text-primary-foreground'}`}
                >
                  {item.label}
                </Button>
              </Fragment>
            ))}
          </div>
        </div>
        {/* Category */}
        {/* <div className="sticky top-0 pt-28 flex items-center justify-center z-50">
          <div className="flex items-center rounded rounded-full bg-white border border-primary w-fit p-1 gap-1 max-w-2xs overflow-auto shadow-xl">
            <span className="px-4 text-md hidden md:block">by Category</span>
            {categories.map((item, index) => (
              <Fragment key={index}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCategory(item.value)}
                  className={`rounded rounded-full ease-in-out ${category === item.value && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'} ${category !== item.value && 'hover:bg-primary hover:text-primary-foreground'}`}
                >
                  {item.label}
                </Button>
              </Fragment>
            ))}
          </div>
          <Button
            variant="icon"
            size=""
            className="py-0 bg-white"
          >
            <Search className="scale-150" />
          </Button>
        </div> */}

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 mt-4">
          {/* {!!showProducts && showProducts.map((item, index) => ( */}
          {type === "sewa" ? !!rentProducts && rentProducts.map((item, index) => (
            <Fragment key={index}>
              <ProductCard
                product={item}
                type={type}
                setItem={type === "sewa" ? setRentItemOrder : setSellItemOrder}
              />
            </Fragment>
          )) : !loadingSell && sellProducts.map((item, index) => (
            <Fragment key={index}>
              <ProductCard
                product={item.product}
                type={type}
                setItem={type === "sewa" ? setRentItemOrder : setSellItemOrder}
              />
            </Fragment>
          ))}
        </div>


      </div>
      <Footer />
    </>
  )
}


const ProductCard = ({ product, type, setItem }) => {
  return (
    <div className="flex flex-col border border-primary rounded-md p-4">
      <div className="relative max-w-sm aspect-[1/1] rounded-lg z-0 borderborder-primary">
        <Image
          src={product.image_url ? process.env.NEXT_PUBLIC_ENDPOINT_STORAGE + product.image_url : "/no-image-found.png"}
          fill
          alt={product.name}
          className="object-cover"
        />
      </div>
      <div className="mt- text-sm sm:text-md">
        <p className="text-md font-medium">{product.name}</p>
        {/* <p>Tersedia: {product.tersedia}</p> */}
        {type === "sewa" ? <p>{formatCurrency(product.rent_price)} / Hari</p> : <p>{formatCurrency(product.sell_price)}</p>}
        {/* {product.sell_price && product.sell_price > 0 && <p>Jual: {formatCurrency(product.sell_price)}</p>} */}
      </div>
      {/* <div className="mt-auto pt-2">
        <Button
          className="w-full"
          onClick={() => setItem(prev => ([...prev, product]))}
        >Add to Cart</Button>
      </div> */}
    </div>
  )
}