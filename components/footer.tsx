"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export function Footer() {
  return (
    <footer className="py-8 sm:py-12 md:py-16 bg-card/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
            {/* Brand Section */}
            <div className="space-y-3 sm:space-y-4">
              <Image
                src="/logo.png"
                alt="All Levels Athletics"
                width={200}
                height={60}
                className="h-10 w-auto sm:h-12"
              />
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Transforming lives through personalized online training and revolutionary recovery techniques.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-orange-500/30 text-orange-400 text-xs sm:text-sm">
                  500+ Clients
                </Badge>
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-xs sm:text-sm">
                  98% Success Rate
                </Badge>
              </div>
            </div>

                                                   {/* Services Section */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-base sm:text-lg text-white">Services</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="/services#services" className="hover:text-orange-400 transition-colors text-sm sm:text-base block py-1">
                      Foundation Training
                    </a>
                  </li>
                  <li>
                    <a href="/programs#featured-programs" className="hover:text-orange-400 transition-colors text-sm sm:text-base block py-1">
                      Growth Program
                    </a>
                  </li>
                  <li>
                    <a href="/programs#programs" className="hover:text-orange-400 transition-colors text-sm sm:text-base block py-1">
                      Specialized Programs
                    </a>
                  </li>
                </ul>
              </div>

                          {/* Products Section */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-base sm:text-lg text-white">Products</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="/services#tension-reset-course" className="hover:text-orange-400 transition-colors text-sm sm:text-base block py-1">
                      Tension Reset Course
                    </a>
                  </li>
                  <li>
                    <a href="/services#knot-roller" className="hover:text-orange-400 transition-colors text-sm sm:text-base block py-1">
                      MFRoller
                    </a>
                  </li>
                  <li>
                    <a href="/services#complete-bundle" className="hover:text-orange-400 transition-colors text-sm sm:text-base block py-1">
                      Complete Bundle
                    </a>
                  </li>
                </ul>
              </div>

             {/* Company Section */}
             <div className="space-y-3 sm:space-y-4">
               <h3 className="font-semibold text-base sm:text-lg text-white">Company</h3>
               <ul className="space-y-2 text-muted-foreground">
                 <li>
                   <a href="/about#daniel-ledbetter" className="hover:text-orange-400 transition-colors text-sm sm:text-base block py-1">
                     About Daniel
                   </a>
                 </li>
                 <li>
                   <a href="/contact#contact-form" className="hover:text-orange-400 transition-colors text-sm sm:text-base block py-1">
                     Contact Us
                   </a>
                 </li>
               </ul>
             </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border pt-6 sm:pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="text-center lg:text-left space-y-2">
                <div className="text-muted-foreground text-sm sm:text-base">
                  © 2024 All Levels Athletics LLC. All rights reserved.
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Website: AllLevelsAthletics.com | Email: AllLevelsAthletics@gmail.com
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <Badge 
                  variant="outline" 
                  className="border-orange-500/30 text-orange-400 text-xs sm:text-sm cursor-pointer hover:bg-orange-500/10 transition-colors"
                  onClick={() => window.open('https://www.tiktok.com/@AllLevelsAthletics', '_blank')}
                >
                  TikTok: @AllLevelsAthletics
                </Badge>
                <Badge 
                  variant="outline" 
                  className="border-yellow-500/30 text-yellow-400 text-xs sm:text-sm cursor-pointer hover:bg-yellow-500/10 transition-colors"
                  onClick={() => window.open('https://www.instagram.com/alllevelsathletics?igsh=bWczNm0xNjl6ZjBy', '_blank')}
                >
                  Instagram: @AllLevelsAthletics
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
