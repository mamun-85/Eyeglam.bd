import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="font-serif text-2xl font-bold">
              Eyeglam
            </Link>
            <p className="mt-4 text-sm text-background/70">
              Luxury eyewear for every style. Discover premium sunglasses that
              blend fashion with function.
            </p>
            <p className="mt-3 text-sm text-background/70">
              Physical Shop: House 12, Road 7, Dhanmondi, Dhaka 1205, Bangladesh
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                className="text-background/70 hover:text-background transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="text-background/70 hover:text-background transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="text-background/70 hover:text-background transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Shop
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/wholesale"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  Wholesale
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-frames"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  Custom Frames
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=aviator"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  Aviator
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=wayfarer"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  Wayfarer
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=round"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  Round
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link
                  href="#"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link
                  href="#"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-background/20 pt-8">
          <p className="text-center text-sm text-background/60">
            &copy; {new Date().getFullYear()} Eyeglam. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
