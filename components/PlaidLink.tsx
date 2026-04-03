// import React, { useCallback, useEffect, useState } from 'react'
// import { Button } from './ui/button'
// import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
// import { useRouter } from 'next/navigation';
// import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions';
// import Image from 'next/image';

// const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
//   const router = useRouter();

//   const [token, setToken] = useState('');

//   useEffect(() => {
//     const getLinkToken = async () => {
//       const data = await createLinkToken(user);

//       setToken(data?.linkToken);
//     }

//     getLinkToken();
//   }, [user]);

//   const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
//     await exchangePublicToken({
//       publicToken: public_token,
//       user,
//     })

//     router.push('/');
//   }, [user])
  
//   const config: PlaidLinkOptions = {
//     token,
//     onSuccess
//   }

//   const { open, ready } = usePlaidLink(config);
  
//   return (
//     <>
//       {variant === 'primary' ? (
//         <Button
//           onClick={() => open()}
//           disabled={!ready}
//           className="plaidlink-primary"
//         >
//           Connect bank
//         </Button>
//       ): variant === 'ghost' ? (
//         <Button onClick={() => open()} variant="ghost" className="plaidlink-ghost">
//           <Image 
//             src="/icons/connect-bank.svg"
//             alt="connect bank"
//             width={24}
//             height={24}
//           />
//           <p className='hiddenl text-[16px] font-semibold text-black-2 xl:block'>Connect bank</p>
//         </Button>
//       ): (
//         <Button onClick={() => open()} className="plaidlink-default">
//           <Image 
//             src="/icons/connect-bank.svg"
//             alt="connect bank"
//             width={24}
//             height={24}
//           />
//           <p className='text-[16px] font-semibold text-black-2'>Connect bank</p>
//         </Button>
//       )}
//     </>
//   )
// }

// export default PlaidLink

import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
import { useRouter } from 'next/navigation';
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getLinkToken = async () => {
      try {
        const data = await createLinkToken(user);
        setToken(data?.linkToken);
      } catch (error) {
        console.error('Error creating link token:', error);
      }
    }

    getLinkToken();
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
    setIsLoading(true);
    try {
      await exchangePublicToken({
        publicToken: public_token,
        user,
      })
      router.push('/');
    } catch (error) {
      console.error('Error exchanging public token:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, router]);
  
  const config: PlaidLinkOptions = {
    token,
    onSuccess
  }

  const { open, ready } = usePlaidLink(config);
  
  const handleOpen = () => {
    if (ready && !isLoading) {
      open();
    }
  };

  // Primary variant - Full width button with gradient
  if (variant === 'primary') {
    return (
      <Button
        onClick={handleOpen}
        disabled={!ready || isLoading}
        className={cn(
          "relative w-full group overflow-hidden",
          "bg-gradient-to-r from-cyan-500 to-blue-500",
          "hover:from-cyan-600 hover:to-blue-600",
          "text-white font-semibold py-3 px-4 rounded-xl",
          "shadow-lg hover:shadow-xl transition-all duration-300",
          "disabled:opacity-70 disabled:cursor-not-allowed",
          "transform hover:scale-[1.02] active:scale-[0.98]"
        )}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        
        <div className="relative flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Image 
                src="/icons/connect-bank.svg"
                alt="connect bank"
                width={20}
                height={20}
                className="brightness-0 invert"
              />
              <span>Connect Bank Account</span>
            </>
          )}
        </div>
      </Button>
    )
  }
  
  // Ghost variant - Icon only for collapsed sidebar
  if (variant === 'ghost') {
    return (
      <div className="relative group">
        <Button 
          onClick={handleOpen} 
          variant="ghost" 
          disabled={!ready || isLoading}
          className={cn(
            "relative flex items-center justify-center",
            "w-full p-3 rounded-xl",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "group/ghost"
          )}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-cyan-600 dark:text-cyan-400" />
          ) : (
            <>
              <Image 
                src="/icons/connect-bank.svg"
                alt="connect bank"
                width={22}
                height={22}
                className="transition-transform duration-200 group-hover/ghost:scale-110"
              />
              {/* Tooltip for collapsed state */}
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg pointer-events-none">
                Connect Bank Account
              </div>
            </>
          )}
        </Button>
        
        {/* Optional: Loading indicator dot */}
        {isLoading && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
        )}
      </div>
    )
  }
  
  // Default variant - Used in other contexts
  return (
    <Button 
      onClick={handleOpen} 
      disabled={!ready || isLoading}
      className={cn(
        "relative flex items-center gap-2",
        "bg-white dark:bg-gray-800",
        "border border-gray-200 dark:border-gray-700",
        "hover:bg-gray-50 dark:hover:bg-gray-750",
        "text-gray-700 dark:text-gray-200",
        "font-semibold py-2.5 px-4 rounded-xl",
        "shadow-sm hover:shadow-md",
        "transition-all duration-200",
        "disabled:opacity-70 disabled:cursor-not-allowed",
        "transform hover:scale-[1.01] active:scale-[0.99]"
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Image 
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={20}
            height={20}
          />
          <p className='text-[16px] font-semibold'>
            Connect bank
          </p>
        </>
      )}
    </Button>
  )
}

export default PlaidLink