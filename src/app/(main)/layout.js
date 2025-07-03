import AppSidebar from "@/components/app-sidebar";
import Header from "@/components/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Provider } from "./provider"

export default async function Layout({ children }) {
  return (
    <SidebarProvider>
      <Provider>
        <AppSidebar />
        <div className="bg-gray-100 w-full">
          <Header />
          {children}
        </div>
      </Provider>
    </SidebarProvider>
  )
}