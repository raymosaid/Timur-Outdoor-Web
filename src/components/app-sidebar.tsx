'use client'

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { sidebarNavLinks } from "@/data/sidebarNavLinks";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/actions";


export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar
      className="hidden md:flex"
    >
      <SidebarHeader>
        <div className="flex items-center gap-4">
          <Image
            src={'/logo.png'}
            width={32}
            height={0}
          />
          <span className="text-4xl font-bold">TIMUR</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarNavLinks.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.href === pathname}
                    size="lg"
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <div>
                        <item.icon />
                      </div>
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="lg:p-[10px] xl:p-[24px] 2xl:p-[30px]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
            >
              <form action={signOutAction}>
                <button className="flex w-full items-center gap-2" type="submit">
                  <LogOut />
                  <span>Keluar</span>
                </button>
              </form>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}