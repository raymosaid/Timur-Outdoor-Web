import Link from "next/link";

export const Footer = () => {
  const logo = {
    src: "logo.png",
    alt: "Logo Timur Outdoor",
    title: "Timur Rental Outdoor",
    url: "/",
  }
  const menuItems = [
    {
      title: "Page",
      links: [
        {text: "Home", url: "/"},
        {text: "Catalogue", url: "/catalogue"},
        {text: "Dashboard", url: "/sign-in"}
      ]
    },
    {
      title: "Social",
      links: [
        {text: "Instagram", url: "https://www.instagram.com/timur_outdoor"},
        {text: "Whatsapp", url: "https://wa.me/message/JSO2XNHAZWOEG1"},
        {text: "Maps", url: "https://maps.app.goo.gl/ityGAXQg2ZWt1c6b8"},
      ]
    }
  ]
  const copyright = "© 2025 Timur Outdoor. All rights reserved."

  return (
    <section className="py-10 bg-gray-50 border-gray-100 border-t">
      <div className="container px-5 mx-auto">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <Link href={logo.url}>
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-10"
                  />
                </Link>
                <p className="text-xl font-semibold">{logo.title}</p>
              </div>
              {/* <p className="mt-4 font-bold">{tagline}</p> */}
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      {section.title === "Social" ? (
                        <a href="/" target="_blank">{link.text}</a>
                      ) : (
                        <Link href={link.url}>{link.text}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p>{copyright}</p>
            {/* <ul className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="underline hover:text-primary">
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul> */}
          </div>
        </footer>
      </div>
    </section>
  );
}