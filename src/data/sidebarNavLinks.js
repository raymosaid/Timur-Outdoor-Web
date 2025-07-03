import {
  Bell,
  Globe,
  Home,
  Menu,
  MessageCircle,
  Paintbrush,
  Wrench
} from "lucide-react"

const GenIcon = ({ src, alt }) => (
  <img
    src={src}
    alt={alt || "Icon"}
    className="w-6 h-6 object-contain m-0 p-0"
  />
)

export const sidebarNavLinks = [
  { href: "/kasir", name: "Kasir", icon: () => <GenIcon src={'/icon/material-symbols_store-outline.png'} alt={'Kasir Icon'} /> },
  { href: "/transaction", name: "Riwayat Transaksi", icon: () => <GenIcon src={'/icon/solar_bill-list-linear.png'} alt={'Kasir Icon'} /> },
  { href: "/dashboard", name: "Dashboard", icon: () => <GenIcon src={'/icon/solar_graph-up-broken.png'} alt={'Kasir Icon'} /> },
  { href: "/stock", name: "Atur Barang", icon: () => <GenIcon src={'/icon/lsicon_goods-outline.png'} alt={'Kasir Icon'} /> },
  { href: "/maintenance", name: "Maintenance Barang", icon: () => <Wrench width={24} height={24} /> },
  { href: "/employee", name: "Atur Pegawai", icon: () => <GenIcon src={'/icon/clarity_employee-group-line.png'} alt={'Kasir Icon'} /> },
  { href: "/profile", name: "Profile", icon: () => <GenIcon src={'/icon/ix_user-profile.png'} alt={'Kasir Icon'} /> },
]