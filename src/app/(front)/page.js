'use client'

import { Header } from "@/components/landing/Header"
import { HeroSection } from "@/components/landing/HeroSection"
import { Catalogue } from "@/components/landing/Catalogue"
import { Testimonial } from "@/components/landing/Testimonial"
import { Footer } from "@/components/landing/Footer"
import { Faq } from "@/components/landing/Faq"
import { AudioComponent } from "@/components/landing/Audio"
import { useRef } from "react";

export default function Home() {
  const CatalogueRef = useRef(null)

  const handleScrollToAfterHero = () => {
    CatalogueRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Header />
      <HeroSection handleScroll={handleScrollToAfterHero} />
      <Catalogue sectionRef={CatalogueRef} />
      <Testimonial />
      <Faq />
      <Footer />
      {/* <AudioComponent /> */}
    </>
  );
}
