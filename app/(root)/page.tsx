// import HeaderBox from '@/components/HeaderBox'
// import RecentTransactions from '@/components/RecentTransactions';
// import RightSidebar from '@/components/RightSidebar';
// import TotalBalanceBox from '@/components/TotalBalanceBox';
// import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
// import { getLoggedInUser } from '@/lib/actions/user.actions';

// const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
//   const currentPage = Number(page as string) || 1;
//   const loggedIn = await getLoggedInUser();
//   const accounts = await getAccounts({ 
//     userId: loggedIn.$id 
//   })

//   if(!accounts) return;
  
//   const accountsData = accounts?.data;
//   const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

//   const account = await getAccount({ appwriteItemId })

//   return (
//     <section className="home">
//       <div className="home-content">
//         <header className="home-header">
//           <HeaderBox 
//             type="greeting"
//             title="Welcome"
//             user={loggedIn?.firstName || 'Guest'}
//             subtext="Access and manage your account and transactions efficiently."
//           />

//           <TotalBalanceBox 
//             accounts={accountsData}
//             totalBanks={accounts?.totalBanks}
//             totalCurrentBalance={accounts?.totalCurrentBalance}
//           />
//         </header>

//         <RecentTransactions 
//           accounts={accountsData}
//           transactions={account?.transactions}
//           appwriteItemId={appwriteItemId}
//           page={currentPage}
//         />
//       </div>

//       <RightSidebar 
//         user={loggedIn}
//         transactions={account?.transactions}
//         banks={accountsData?.slice(0, 2)}
//       />
//     </section>
//   )
// }

// export default Home

// app/(root)/page.tsx
import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ 
    userId: loggedIn?.$id 
  });

  if(!accounts?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading your accounts...</p>
        </div>
      </div>
    );
  }
  
  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
      </div>
    }>
      <section className="home">
        <div className="home-content">
          <header className="home-header">
            <HeaderBox 
              type="greeting"
              title="Welcome back"
              user={loggedIn?.firstName || 'Guest'}
              subtext="Here's what's happening with your accounts today."
            />

            <TotalBalanceBox 
              accounts={accountsData}
              totalBanks={accounts?.totalBanks}
              totalCurrentBalance={accounts?.totalCurrentBalance}
            />
          </header>

          <RecentTransactions 
            accounts={accountsData}
            transactions={account?.transactions}
            appwriteItemId={appwriteItemId}
            page={currentPage}
          />
        </div>

        <RightSidebar 
          user={loggedIn}
          transactions={account?.transactions}
          banks={accountsData?.slice(0, 2)}
        />
      </section>
    </Suspense>
  )
}

export default Home