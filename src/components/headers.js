'use client'

import { sidebarNavLinks } from "@/data/sidebarNavLinks";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { Fragment, useContext } from "react";
import { HeaderContext } from "@/app/(main)/provider";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header({
  // inputActive,
  listBreadcrumb,
}) {
  const pathname = usePathname()
  const { user, headerInput, setHeaderInput } = useContext(HeaderContext)
  const inputActivePage = [
    { href: "/kasir", placeholder: "Cari Barang" },
    { href: "/transaction", placeholder: "Cari Transaksi"},
    { href: "/stock", placeholder: "Cari Barang"},
    { href: "/maintenance", placeholder: "Cari Barang"},
  ]
  
  return (
    <header className="sticky top-0 bg-white z-1000 flex h-[100px] relative shadow-lg bg-white shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2 px-[30px]">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-6 bg-primary"
          />
          {!listBreadcrumb ? (
            <div className="text-2xl font-semibold">{sidebarNavLinks.find(d => pathname.startsWith(d.href))?.name}</div>
          ) : (
            <Breadcrumb>
              <BreadcrumbList>
                {listBreadcrumb && listBreadcrumb.map((item, index) => {
                  if (index+1 !== listBreadcrumb.length) { return (
                    <Fragment key={index}>
                      <BreadcrumbItem className='hidden md:block'>
                        <BreadcrumbLink className="text-2xl font-semibold" href={item.url}>{item.title}</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block [&>svg]:w-fit [&>svg]:h-fit"/>
                    </Fragment>
                  )} else { return (
                    <BreadcrumbItem key={index}>
                      <BreadcrumbPage className="text-2xl font-semibold">{item.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  )}
                })}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        <div className="flex items-center gap-[30px] pr-[30px]">
          {inputActivePage.some(d => d.href === pathname) && (
            <Input
              value={headerInput}
              onChange={(e) => setHeaderInput(e.target.value)}
              placeholder={inputActivePage.find(d => d.href === pathname).placeholder}
            />
          )}
          <Separator orientation="vertical" className="h-[40px] bg-primary" />
          <div className="flex flex-row justify-between items-center min-w-[calc(485px-30px-30px)] gap-[25px]">
            <div className="flex flex-row items-center gap-[25px]">
              <Avatar>
                <AvatarImage src={process.env.NEXT_PUBLIC_ENDPOINT_STORAGE + user?.user_metadata.avatar_url} alt="photo-profile" />
                <AvatarFallback>{user ? (user?.username ? user.username.charAt(0).toUpperCase() : user?.email.charAt(0).toUpperCase()) : "L"}</AvatarFallback>
              </Avatar>
              <div className="">
                <div className="text-xl font-medium">{user ? (user.user_metadata.username ? user.user_metadata.username : user?.email.split("@")[0]) : "Loading"}</div>
                <div>{user?.user_role ? capitalizeFirstLetter(user.user_role) : "Pegawai"}</div>
              </div>
            </div>
            <div>
              <Bell />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}