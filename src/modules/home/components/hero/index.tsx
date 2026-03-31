import Image from "next/image"
import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-gradient-to-br from-ceedmart-navy via-ceedmart-navy-light to-ceedmart-blue">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <Image
          src="/logo.png"
          alt="CeedMart"
          width={80}
          height={80}
          className="h-20 w-20"
        />
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-white font-bold"
          >
            Welcome to CeedMart
          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-white/80 font-normal"
          >
            Wholesale & Bulk Orders
          </Heading>
        </span>
        <LocalizedClientLink href="/store">
          <Button
            variant="secondary"
            className="bg-ceedmart-gold text-ceedmart-navy font-semibold border-none hover:bg-ceedmart-gold/90"
          >
            Shop Now
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Hero
