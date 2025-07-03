import { Fragment, useEffect, useState } from "react"
import { fetchCatalogueList, useRentProductCatalogue, useSellProductCatalogue } from "@/lib/data"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"

export const Catalogue = ({ sectionRef }) => {
  const { data: rentProducts, isLoading: loadingRents } = useRentProductCatalogue()
  const { data: sellProducts, isLoading: loadingSell } = useSellProductCatalogue()
  const [products, setProducts] = useState(null)
  const [visibleProducts, setVisibleProducts] = useState([])
  const isMobile = useIsMobile()

  useEffect(() => {
    fetchCatalogueList(setProducts)
  }, [])

  useEffect(() => {
    if (!!products) {
      if (isMobile) setVisibleProducts(products.slice(0, 4))
      else setVisibleProducts(products)
    }
  }, [isMobile, products])

  return (
    <section
      ref={sectionRef}
      className="container px-5 py-16 mx-auto"
    >
      <h1 className="text-3xl font-medium title-font text-gray-900 mb-12 text-center">Barang Sewa</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
        {!!products && visibleProducts.map(item => (
          <Fragment key={item.id}>
            <ProductCard
              product={item}
            />
          </Fragment>
        ))}
      </div>
      <div className="mt-8 flex justify-center items-center">
        <Link
          href={"/catalogue"}
          className="border p-2 px-6 rounded-full text-center hover:shadow-md hover:bg-gray-100/60"
        >
          Show More
        </Link>
      </div>
    </section>
  )
}

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-lg border-primary/0 p-2">
      <div className="relative max-w-sm aspect-[1/1] rounded-lg">
        <Image
          src={product.image_url ? process.env.NEXT_PUBLIC_ENDPOINT_STORAGE + product.image_url : "/no-image-found.png"}
          fill
          alt={product.name}
          className="object-cover"
        />
      </div>
      <div className="mt-4">
        <p className="text-md font-medium">{product.name}</p>
        {/* <p>Tersedia: {product.tersedia}</p> */}
        <p>{formatCurrency(product.rent_price)} / Hari</p>
      </div>
    </div>
  )
}