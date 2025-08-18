"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-orange-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-heading text-xl font-bold gradient-text">
            ALL LEVELS ATHLETICS
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-orange-400 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-white hover:text-orange-400 transition-colors">
              About
            </Link>
            <Link href="/services" className="text-white hover:text-orange-400 transition-colors">
              Services
            </Link>
            <Link href="/programs" className="text-white hover:text-orange-400 transition-colors">
              Programs
            </Link>
            <Link href="/team" className="text-white hover:text-orange-400 transition-colors">
              Team
            </Link>
            <Link href="/contact" className="text-white hover:text-orange-400 transition-colors">
              Contact
            </Link>
            <Link href="/blog" className="text-white hover:text-orange-400 transition-colors">
              Blog
            </Link>
            <Button className="gradient-orange-yellow text-black font-bold">Start Trial</Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link href="/" className="block text-white hover:text-orange-400 transition-colors">
              Home
            </Link>
            <Link href="/about" className="block text-white hover:text-orange-400 transition-colors">
              About
            </Link>
            <Link href="/services" className="block text-white hover:text-orange-400 transition-colors">
              Services
            </Link>
            <Link href="/programs" className="block text-white hover:text-orange-400 transition-colors">
              Programs
            </Link>
            <Link href="/team" className="block text-white hover:text-orange-400 transition-colors">
              Team
            </Link>
            <Link href="/contact" className="block text-white hover:text-orange-400 transition-colors">
              Contact
            </Link>
            <Link href="/blog" className="block text-white hover:text-orange-400 transition-colors">
              Blog
            </Link>
            <Button className="gradient-orange-yellow text-black font-bold w-full">Start Trial</Button>
          </div>
        )}
      </div>
    </nav>
  )
}
