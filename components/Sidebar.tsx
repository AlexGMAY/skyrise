'use client'

import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import Footer from './Footer'
import PlaidLink from './PlaidLink'

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const isExpanded = !isCollapsed || isHovered;
  const sidebarWidth = isExpanded ? 'w-72' : 'w-20';
  const mobileWidth = isMobileOpen ? 'translate-x-0' : '-translate-x-full';

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white dark:bg-gray-900 p-2.5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Desktop Toggle Button */}
      {!isMobile && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="fixed top-24 z-50 hidden lg:flex items-center justify-center w-6 h-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
          style={{ left: isExpanded ? 'calc(18rem - 12px)' : 'calc(5rem - 12px)' }}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      )}

      {/* Sidebar Container */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full bg-gradient-to-b from-white via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/50",
          "border-r border-gray-200 dark:border-gray-800 shadow-2xl z-40",
          "transition-all duration-300 ease-in-out",
          "flex flex-col",
          // Mobile styles
          "lg:translate-x-0",
          mobileWidth,
          // Desktop styles
          sidebarWidth
        )}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Animated Gradient Border */}
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-gradient-x" />

        {/* Logo Section */}
        <div className={cn(
          "flex items-center gap-3 px-4 py-6 border-b border-gray-200 dark:border-gray-800 transition-all duration-300",
          isExpanded ? "justify-start" : "justify-center"
        )}>
          <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
            <Image 
              src="/icons/logo.svg"
              width={28}
              height={28}
              alt="SkyRise logo"
              className="size-[22px] invert dark:invert transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          
          {isExpanded && (
            <div className="overflow-hidden">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent whitespace-nowrap">
                Sky<span className="text-cyan-600 dark:text-cyan-400">Rise</span>
              </h1>              
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 py-6">
          <div className="space-y-1.5 px-3">
            {sidebarLinks.map((item) => {
              const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)
              
              return (
                <Link 
                  href={item.route} 
                  key={item.label}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                    "hover:bg-gray-100 dark:hover:bg-gray-800/50",
                    isActive && "bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border border-cyan-200/50 dark:border-cyan-800/50",
                    isExpanded ? "justify-start" : "justify-center"
                  )}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-r-full shadow-sm" />
                  )}
                  
                  {/* Icon Container */}
                  <div className={cn(
                    "relative flex items-center justify-center transition-all duration-200",
                    isActive ? "text-cyan-600 dark:text-cyan-400" : "text-gray-500 dark:text-gray-400",
                    "group-hover:scale-110"
                  )}>
                    <Image 
                      src={item.imgURL}
                      alt={item.label}
                      width={20}
                      height={20}
                      className={cn(
                        "transition-all duration-200",
                        isActive && "brightness-0 dark:brightness-200",
                        !isExpanded && "w-5 h-5"
                      )}
                    />
                  </div>

                  {/* Label */}
                  {isExpanded && (
                    <span className={cn(
                      "text-sm font-medium transition-all duration-200 whitespace-nowrap",
                      isActive ? "text-cyan-700 dark:text-cyan-300" : "text-gray-700 dark:text-gray-300",
                      "group-hover:text-cyan-600 dark:group-hover:text-cyan-400"
                    )}>
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {!isExpanded && !isMobile && (
                    <div className="absolute left-full ml-2 px-2 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* PlaidLink Section */}
          <div className={cn(
            "mt-6 px-3",
            isExpanded ? "block" : "flex justify-center"
          )}>
            <PlaidLink 
              user={user} 
              variant={isExpanded ? "primary" : "ghost"}
            />
          </div>
        </nav>

        {/* Footer Section */}
        <div className={cn(
          "border-t border-gray-200 dark:border-gray-800 transition-all duration-300",
          isExpanded ? "p-4" : "p-3"
        )}>
          <Footer 
            user={user} 
            type={isExpanded ? "desktop" : "mobile"}
          />
        </div>
      </aside>

      {/* Main Content Spacer */}
      {!isMobile && (
        <div className={cn(
          "transition-all duration-300 hidden lg:block",
          isExpanded ? "ml-72" : "ml-20"
        )} />
      )}
    </>
  )
}

export default Sidebar