export const Testimonial = () => {
  const reviews = [
    {
      name: "Rizka Aulia",
      image_url: "https://lh3.googleusercontent.com/a-/ALV-UjUGISmSqlE2w3FLWPeGWQSidG3oibaz_055972CefcexD4KNHE=w36-h36-p-rp-mo-br100",
      content: "guyss ga boong, aku sewa alat gunung di timur outdoor harga nya affordable bgtt worth it parah murah tapi barangnya pada branded dan bagus bagus no minus pulakk, aku pernah sewa hydropack di outdoor orang 50/24jam cuma di timut outdoor woi 10rebuu doang 24jam, pokonya next kalo aku maupun kalian mau hiking atau kemanapun butuh alat outdoor aku rekomend ke timur outdoor sukses terus makin majuu karna syudaa bikin aku hwappy dgn harganyaa😍",
      link: "https://maps.app.goo.gl/pkzR9SKDh8mYkzXLA",
    },
    {
      name: "zyeaah",
      image_url: "https://lh3.googleusercontent.com/a-/ALV-UjW2I7OgK7FkyGrpxtcFrLzp7_ylxmmcDJvtYPVt7lLfm5XKamMS=w36-h36-p-rp-mo-br100",
      content: "trusted, affordable price! kondisi barang saangat baik. ada jasa anter jemput segala lagi, asik bat kan tinggal nunggu, barang dateng. admin ramah & santaii. makasi loh timur outdoor, puas deh pokoknya, next trip mau sewa disini lagi ;)",
      link: "https://maps.app.goo.gl/vnf95wTFYfo2AwPs5",
    },
    {
      name: "005_Juan_Tegar_Augusta",
      image_url: "https://lh3.googleusercontent.com/a-/ALV-UjXcmgt8JoSwFlLnIh187b6OgGnWHHoQY4CcfAvQDOsGMPINqXgK=w36-h36-p-rp-mo-br100",
      content: "Pelayanannya keren, bahkan ada jasa delivery-nya juga. Sangat membantu ketika harus sewa alat camping, tapi banyak hal lain yang harus diurusi. Kualitas barang juga gak bohong. Kakaknya juga ramah-ramah. 5/5 no debat.  o7",
      link: "https://maps.app.goo.gl/rbKGDV7mVR81fDwB6",
    },
    {
      name: "Gwynbee",
      image_url: "https://lh3.googleusercontent.com/a-/ALV-UjUfiWlAlMZoAs_viVX8pgV09gXzuvziRUdVawAAi3_fbc5ejOA=w36-h36-p-rp-mo-br100",
      content: "Baru pertama kali sewa peralatan outdoor di sini, dan WOWWW, nggak kecewa sama sekali! Peralatannya super bersih, terawat, dan siap pakai. Bikin acara jadi lancar tanpa khawatir peralatan kotor atau rusak. Pelayanan juga top ramah banget!😍❤️‍🔥",
      link: "https://maps.app.goo.gl/vYCEh1yKjeNU5ydY6",
    },
  ]
  return (
    <section
      className="text-gray-600 body-font"
    >
      <div className="container px-5 py-16 mx-auto">
        <h1 className="text-3xl font-medium title-font text-gray-900 mb-12 text-center">Testimonials</h1>
        <div className="flex flex-wrap -m-4">
          {reviews.map((item, index) => (
            <a key={index} className="p-4 md:w-1/2 w-full" href={item.link} target="_blank">
              <div className="h-full bg-gray-100 p-8 rounded flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="block w-5 h-5 text-gray-400 mb-4" viewBox="0 0 975.036 975.036">
                  <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                </svg>
                <p className="leading-relaxed mb-6">{item.content}</p>
                <div className="inline-flex items-center mt-auto">
                  <img alt={`avatar-${item.name}`} src={item.image_url ? item.image_url : "https://dummyimage.com/107x107"} className="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center"/>
                  <span className="flex-grow flex flex-col pl-4">
                    <span className="title-font font-medium text-gray-900">{item.name}</span>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}