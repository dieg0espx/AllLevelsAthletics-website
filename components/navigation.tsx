"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-orange-500/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="All Levels Athletics"
                width={50}
                height={50}
                className="h-8 w-auto sm:h-10 md:h-12 group-hover:scale-105 transition-transform duration-300"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg opacity-0 group-hover:opacity-10 blur-sm transition-opacity duration-300"></div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link 
              href="/" 
              className={`transition-all duration-300 font-medium relative group text-sm xl:text-base ${
                isActive("/") 
                  ? "text-orange-400" 
                  : "text-white/90 hover:text-orange-400"
              }`}
            >
              Home
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-300 ${
                isActive("/") ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
            <Link 
              href="/about" 
              className={`transition-all duration-300 font-medium relative group text-sm xl:text-base ${
                isActive("/about") 
                  ? "text-orange-400" 
                  : "text-white/90 hover:text-orange-400"
              }`}
            >
              About
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-300 ${
                isActive("/about") ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
            <Link 
              href="/services" 
              className={`transition-all duration-300 font-medium relative group text-sm xl:text-base ${
                isActive("/services") 
                  ? "text-orange-400" 
                  : "text-white/90 hover:text-orange-400"
              }`}
            >
              Services
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-300 ${
                isActive("/services") ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
            <Link 
              href="/programs" 
              className={`transition-all duration-300 font-medium relative group text-sm xl:text-base ${
                isActive("/programs") 
                  ? "text-orange-400" 
                  : "text-white/90 hover:text-orange-400"
              }`}
            >
              Programs
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-300 ${
                isActive("/programs") ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
            <Link 
              href="/contact" 
              className={`transition-all duration-300 font-medium relative group text-sm xl:text-base ${
                isActive("/contact") 
                  ? "text-orange-400" 
                  : "text-white/90 hover:text-orange-400"
              }`}
            >
              Contact
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-300 ${
                isActive("/contact") ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold px-6 xl:px-8 py-2 xl:py-3 rounded-full shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all duration-300 group text-sm xl:text-base">
              <span className="flex items-center gap-2">
                Start Trial
                <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white/90 hover:text-orange-400 transition-colors duration-300 p-2 rounded-lg hover:bg-white/10 hover:scale-110 active:scale-95 touch-manipulation" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 sm:py-6 space-y-2 sm:space-y-3 border-t border-orange-500/20 bg-black/95 backdrop-blur-md shadow-2xl">
            <Link 
              href="/" 
              className={`block transition-all duration-300 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-white/5 hover:scale-105 active:scale-95 touch-manipulation text-base sm:text-lg ${
                isActive("/") ? "text-orange-400 bg-orange-500/10 border border-orange-500/30" : "text-white/90 hover:text-orange-400"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`block transition-all duration-300 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-white/5 hover:scale-105 active:scale-95 touch-manipulation text-base sm:text-lg ${
                isActive("/about") ? "text-orange-400 bg-orange-500/10 border border-orange-500/30" : "text-white/90 hover:text-orange-400"
              }`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/services" 
              className={`block transition-all duration-300 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-white/5 hover:scale-105 active:scale-95 touch-manipulation text-base sm:text-lg ${
                isActive("/services") ? "text-orange-400 bg-orange-500/10 border border-orange-500/30" : "text-white/90 hover:text-orange-400"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/programs" 
              className={`block transition-all duration-300 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-white/5 hover:scale-105 active:scale-95 touch-manipulation text-base sm:text-lg ${
                isActive("/programs") ? "text-orange-400 bg-orange-500/10 border border-orange-500/30" : "text-white/90 hover:text-orange-400"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Programs
            </Link>
            <Link 
              href="/contact" 
              className={`block transition-all duration-300 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-white/5 hover:scale-105 active:scale-95 touch-manipulation text-base sm:text-lg ${
                isActive("/contact") ? "text-orange-400 bg-orange-500/10 border border-orange-500/30" : "text-white/90 hover:text-orange-400"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 sm:pt-6 border-t border-orange-500/20">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all duration-300 touch-manipulation">
                <span className="flex items-center justify-center gap-2 text-base sm:text-lg">
                  Start Trial
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
