// import { logoutAccount } from '@/lib/actions/user.actions'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'
// import React from 'react'

// const Footer = ({ user, type = 'desktop' }: FooterProps) => {
//   const router = useRouter();

//   const handleLogOut = async () => {
//     const loggedOut = await logoutAccount();

//     if(loggedOut) router.push('/sign-in')
//   }

//   return (
//     <footer className="footer">
//       <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
//         <p className="text-xl font-bold text-gray-700">
//           {user?.firstName[0]}
//         </p>
//       </div>

//       <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
//           <h1 className="text-14 truncate text-gray-700 font-semibold">
//             {user?.firstName}
//           </h1>
//           <p className="text-14 truncate font-normal text-gray-600">
//             {user?.email}
//           </p>
//       </div>

//       <div className="footer_image" onClick={handleLogOut}>
//         <Image src="icons/logout.svg" fill alt="jsm" />
//       </div>
//     </footer>
//   )
// }

// export default Footer

// Footer.tsx (Enhanced version)
import { logoutAccount } from '@/lib/actions/user.actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { cn } from '@/lib/utils'
import { LogOut } from 'lucide-react'

const Footer = ({ user, type = 'desktop' }: FooterProps) => {
  const router = useRouter();

  const handleLogOut = async () => {
    const loggedOut = await logoutAccount();
    if(loggedOut) router.push('/sign-in')
  }

  const isMobile = type === 'mobile';

  return (
    <div className={cn(
      "flex items-center gap-3 transition-all duration-200",
      isMobile ? "flex-col justify-center" : "flex-row",
      "group"
    )}>
      {/* User Avatar */}
      <div 
        className={cn(
          "flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30",
          "border border-cyan-200 dark:border-cyan-800/50",
          isMobile ? "w-10 h-10" : "w-10 h-10",
          "shadow-sm group-hover:shadow-md transition-all duration-200"
        )}
      >
        <p className={cn(
          "font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent",
          isMobile ? "text-lg" : "text-lg"
        )}>
          {user?.firstName?.[0] || user?.name?.[0] || 'U'}
        </p>
      </div>

      {/* User Info */}
      {!isMobile && (
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">
            {user?.firstName || user?.name || 'User'}
          </h1>
          <p className="text-xs font-normal text-gray-500 dark:text-gray-400 truncate">
            {user?.email || 'user@example.com'}
          </p>
        </div>
      )}

      {isMobile && (
        <div className="text-center">
          <h1 className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[60px]">
            {user?.firstName || user?.name || 'User'}
          </h1>
        </div>
      )}

      {/* Logout Button */}
      <button
        onClick={handleLogOut}
        className={cn(
          "relative flex items-center justify-center rounded-lg transition-all duration-200",
          "hover:bg-red-50 dark:hover:bg-red-950/30",
          isMobile ? "p-2" : "p-2",
          "group/logout"
        )}
        title="Logout"
      >
        <Image 
          src="/icons/logout.svg" 
          alt="logout" 
          width={18} 
          height={18}
          className="opacity-60 group-hover/logout:opacity-100 transition-opacity duration-200"
        />
      </button>

      {/* Tooltip for collapsed state */}
      {isMobile && (
        <div className="absolute right-full mr-2 px-2 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg pointer-events-none">
          {user?.email || user?.name}
        </div>
      )}
    </div>
  )
}

export default Footer