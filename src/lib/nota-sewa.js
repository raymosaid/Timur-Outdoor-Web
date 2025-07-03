import { formatCurrency } from "@/lib/utils"
import { Document, Font, Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { format, parseJSON, subHours } from "date-fns"

Font.register({
  family: 'Poppins',
  fonts: [
    {
      src: '/fonts/SpaceGrotesk-Regular.ttf',
      fontWeight: 'normal',
    },
    {
      src: '/fonts/SpaceGrotesk-Bold.ttf',
      fontWeight: 'bold',
    },
  ]
})

export const NotaSewa = ({ transaction, listItemOrder, rincian }) => {
  return (
    <Document title={`Nota Penyewaan Tanggal `}>
      <Page size={"A5"} style={styles.page} wrap={listItemOrder.length > 5 ? false : true}>

        {/* Header */}
        <View style={styles.header}>
          <Image src={'/logo.png'} style={styles.logoImage}/>
          <Image src={'/logo.png'} style={[styles.logoImage, { right: 0}]}/>
          <Text style={styles.title}>Timur Rental Outdoor</Text>
          <Text style={styles.subtitle}>MENJUAL DAN MENYEWAKAN ALAT OUTDOOR</Text>
          <View style={styles.info}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
              <Link src="https://wa.me/message/JSO2XNHAZWOEG1" style={styles.link}>PHONE: 085659762975</Link>
              <Link src="https://www.instagram.com/timur_outdoor" style={styles.link}>INSTAGRAM: @TIMUROUTDOOR</Link>
            </View>
            <Link src="https://maps.app.goo.gl/ityGAXQg2ZWt1c6b8" style={styles.link}>
              JL. KOLONEL AHMAD SYAM NO 176 (SAMPING BAROKAH FROZEN FOOD){'\n'}
              DESA SAYANG, KEC. JATINANGOR, KAB. SUMEDANG
            </Link>
          </View>
        </View>

        {/* Item */}
        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell]}>No</Text>
            <Text style={[styles.tableCell]}>Barang</Text>
            <Text style={styles.tableCell}>Harga</Text>
            <Text style={styles.tableCell}>Qty</Text>
            <Text style={styles.tableCell}>Total</Text>
          </View>
          {listItemOrder.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{index + 1}</Text>
              <Text style={[styles.tableCell, {textAlign: 'left'}]}>{item.product.name}</Text>
              <Text style={styles.tableCell}>{formatCurrency(item.price_at_transaction)}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>{formatCurrency(item.price_at_transaction * item.quantity)}</Text>
            </View>
          ))}
          <View style={{ marginTop: 8 }}>
            {rincian.map((item, index) => (
              <View key={index} style={styles.rincianContainer}>
                <Text>{item.title}</Text>
                <Text style={[{ marginLeft: "auto" }]}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 'auto', paddingTop: 8 }}>

          {/* Detail */}
          <View style={styles.detail}>
            <Text style={styles.detailText}>Nama Penyewa: {transaction.get("name")}</Text>
            <Text style={styles.detailText}>No. Handphone: {transaction.get("phone_number")}</Text>
            <Text style={styles.detailText}>Jaminan: {transaction.get("jaminan")}</Text>
            <Text style={styles.detailText}>Tanggal Pengambilan: {format(subHours(parseJSON(transaction.get('tanggal_pengambilan')), 7), 'dd MMMM yyyy, HH.mm')}</Text>
            <Text style={styles.detailText}>Tanggal Pengembalian: {format(subHours(parseJSON(transaction.get('tanggal_pengembalian')), 7), 'dd MMMM yyyy, HH.mm')}</Text>
            <Text style={styles.detailText}>Down Payment: {formatCurrency(transaction.get("down_payment"))}</Text>
            <Text style={styles.detailText}>Sisa: {formatCurrency(transaction.get("total_amount") - transaction.get("down_payment"))}</Text>
          </View>
          
          {/* Note */}
          <View style={styles.note}>
            <Text style={styles.noteTitle}>NOTE:</Text>
            <Text style={styles.noteText}>1. PENYEWA WAJIB MENJAMINKAN JAMINAN BERUPA KARTU IDENTITAS (KTP/SIM/KTM/PELAJAR DLL)</Text>
            <Text style={styles.noteText}>2. KETERLAMBATAN PENGEMBALIAN DIKENAKAN BIAYA DENDA PER JAM TERHITUNG DARI JAM PENGEMBALIAN</Text>
            <Text style={styles.noteText}>3. SEGALA BENTUK KEHILANGAN DAN KERUSAKAN BARANG SECARA TIDAK WAJAR MENJADI TANGGUNG JAWAB PENYEWA</Text>
            <Text style={styles.noteText}>4. NOTA/BUKTI PEMBAYARAN HARAP DISIMPAN DAN DIBAWA PADA SAAT PENGEMBALIAN BARANG</Text>
          </View>
        
        </View>

      </Page>
    </Document>
  )
}


const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 20,
    // display: "flex",
    // justifyContent: "space-between",
    fontFamily: 'Poppins'
  },
  header: {
    textAlign: 'center',
    fontSize: 12
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 8
  },
  info: {
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 14,
  },
  link: {
    color: 'black'
  },
  logoImage: {
    width: 30,
    height: 30,
    position: 'absolute'
  },
  table: {
    border: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 5
  },
  tableCell: {
    flex: 1,
    // border: 1,
    fontSize: 10,
    textAlign: 'center',
  },
  total: {
    marginTop: 10,
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  totalText: {
    marginTop: 10,
    textAlign: 'right'
  },
  rincianContainer: {
    marginVertical: 2,
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: "5%"
  },
  rincian: {
    
  },
  detail: {
    fontSize: 10,
  },
  detailText: {
    marginTop: 2,
    borderWidth: 1,
    padding: 2,
  },
  noteTitle: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: 'bold' 
  },
  note: {
    fontSize: 8,
  },
  noteText: {
    marginTop: 0
  }
})