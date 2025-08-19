"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-orange-500/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="All Levels Athletics"
                width={50}
                height={50}
                className="h-12 w-auto group-hover:scale-105 transition-transform duration-300"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg opacity-0 group-hover:opacity-10 blur-sm transition-opacity duration-300"></div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-white/90 hover:text-orange-400 transition-all duration-300 font-medium relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/about" 
              className="text-white/90 hover:text-orange-400 transition-all duration-300 font-medium relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/services" 
              className="text-white/90 hover:text-orange-400 transition-all duration-300 font-medium relative group"
            >
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/programs" 
              className="text-white/90 hover:text-orange-400 transition-all duration-300 font-medium relative group"
            >
              Programs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/contact" 
              className="text-white/90 hover:text-orange-400 transition-all duration-300 font-medium relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all duration-300 group">
              <span className="flex items-center gap-2">
                Start Trial
                <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white/90 hover:text-orange-400 transition-colors duration-300 p-2 rounded-lg hover:bg-white/10" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 space-y-4 border-t border-orange-500/20 bg-black/95 backdrop-blur-md">
            <Link 
              href="/" 
              className="block text-white/90 hover:text-orange-400 transition-colors duration-300 font-medium py-2 px-4 rounded-lg hover:bg-white/5"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="block text-white/90 hover:text-orange-400 transition-colors duration-300 font-medium py-2 px-4 rounded-lg hover:bg-white/5"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/services" 
              className="block text-white/90 hover:text-orange-400 transition-colors duration-300 font-medium py-2 px-4 rounded-lg hover:bg-white/5"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/programs" 
              className="block text-white/90 hover:text-orange-400 transition-colors duration-300 font-medium py-2 px-4 rounded-lg hover:bg-white/5"
              onClick={() => setIsOpen(false)}
            >
              Programs
            </Link>
            <Link 
              href="/contact" 
              className="block text-white/90 hover:text-orange-400 transition-colors duration-300 font-medium py-2 px-4 rounded-lg hover:bg-white/5"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold py-3 rounded-full shadow-lg hover:shadow-orange-500/25 transition-all duration-300">
                <span className="flex items-center justify-center gap-2">
                  Start Trial
                  <Zap className="w-4 h-4" />
                </span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
