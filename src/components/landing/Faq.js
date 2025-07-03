import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const Faq = () => {
  const Questions = [
    {
      "q": "Min hitungan sewanya gimana?",
      "a": "Hitungan sewanya 24 jam/hari kak, misal kaka sewa jam pagi, berarti kembali jam pagi."
    },
    {
      "q": "Aku mau sewa buat sabtu-minggu berarti di ambilnua kapan min?",
      "a": "Hitungan sewa dihitung ketika pengambilan peralatan kak, jadinya kakanya bebas mau ambilnya kapan aja. Misalnya kalo mau sewa sabtu-minggu tapi diambilnya jum’at sore, berarti kehitungnya 2 hari kak."
    },
    {
      "q": "Syarat sewanya apa aja min?",
      "a": "Syaratnya punya uang kak 🙂 dan menitipkan Jaminan berupa KTP/SIM/KTM/KARTU PELAJAR punya sendiri, yang masih aktif."
    },
    {
      "q": "Kalo kena dendanya berapa min?",
      "a": "Dendanya terhitung 1 hari sewa lagi kak, lebih baik ngabarin ya kak biar ga di denda."
    },
    {
      "q": "Kalo telat ngembaliinnya gimana kak?",
      "a": "Kalo telat ada toleransinya kok ka, asalkan ada kabar masih di perjalanan masih ditoleransi. Dan pengembalian hanya di jam operasional 08.00–20.30. Lebih dari jam 20.30 dilayani esok harinya dengan denda nominal 1 hari."
    },
    {
      "q": "Bisa di antar jemput ga kak?",
      "a": "Bisa kak, untuk Senangor Raya ongkir antar 5k, jika dijemput nambah lagi 5k."
    },
    {
      "q": "Kalo peralatannya ada yang rusak atau hilang gimana min?",
      "a": "Kerusakan dan kehilangan ditanggung penyewa kak. Kalo rusak ringan akan didenda sesuai daftar denda yang kami miliki. Tapi kalo rusak berat yang menyebabkan peralatan tidak bisa digunakan kembali, maka sama dengan peralatan hilang, didenda dengan nominal harga beli peralatan tersebut."
    },
  ]

  return (
    <section className="container px-5 py-16 mx-auto">
      <h1 className="text-3xl font-medium title-font text-gray-900 mb-12 text-center">Frequently Asked Questions</h1>
      <Accordion
        type="single"
        collapsible
        className="grid grid-cols-1 md:grid-cols-2 gap-x-8 px-4 sm:px-0"
        defaultValue="item-1"
      >
        {Questions.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="">{item.q}</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>{item.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}