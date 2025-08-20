import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export function Footer() {
  return (
    <footer className="py-16 bg-card/50 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <Image
                src="/logo.png"
                alt="All Levels Athletics"
                width={200}
                height={60}
                className="h-12 w-auto"
              />
              <p className="text-muted-foreground">
                Transforming lives through personalized online training and revolutionary recovery techniques.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                  500+ Clients
                </Badge>
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                  98% Success Rate
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Services</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="/services" className="hover:text-orange-400 transition-colors">
                    Foundation Training
                  </a>
                </li>
                <li>
                  <a href="/services" className="hover:text-orange-400 transition-colors">
                    Growth Program
                  </a>
                </li>
                <li>
                  <a href="/services" className="hover:text-orange-400 transition-colors">
                    Elite Coaching
                  </a>
                </li>
                <li>
                  <a href="/programs" className="hover:text-orange-400 transition-colors">
                    Specialized Programs
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Products</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#products" className="hover:text-orange-400 transition-colors">
                    Tension Reset Course
                  </a>
                </li>
                <li>
                  <a href="#products" className="hover:text-orange-400 transition-colors">
                    MFRoller
                  </a>
                </li>
                <li>
                  <a href="#products" className="hover:text-orange-400 transition-colors">
                    Complete Bundle
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-orange-400 transition-colors">
                    Free Resources
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="/about" className="hover:text-orange-400 transition-colors">
                    About Daniel
                  </a>
                </li>
                <li>
                  <a href="/team" className="hover:text-orange-400 transition-colors">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-orange-400 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-orange-400 transition-colors">
                    Blog & Resources
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <div className="text-muted-foreground mb-2">
                  © 2024 All Levels Athletics LLC. All rights reserved.
                </div>
                <div className="text-sm text-muted-foreground">
                  Website: AllLevelsAthletics.com | Email: AllLevelsAthletics@gmail.com
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                  TikTok: @AllLevelsAthletics
                </Badge>
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
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
