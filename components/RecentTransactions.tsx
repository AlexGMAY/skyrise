// import Link from 'next/link'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { BankTabItem } from './BankTabItem'
// import BankInfo from './BankInfo'
// import TransactionsTable from './TransactionsTable'
// import { Pagination } from './Pagination'

// const RecentTransactions = ({
//   accounts,
//   transactions = [],
//   appwriteItemId,
//   page = 1,
// }: RecentTransactionsProps) => {
//   const rowsPerPage = 10;
//   const totalPages = Math.ceil(transactions.length / rowsPerPage);

//   const indexOfLastTransaction = page * rowsPerPage;
//   const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

//   const currentTransactions = transactions.slice(
//     indexOfFirstTransaction, indexOfLastTransaction
//   )

//   return (
//     <section className="recent-transactions">
//       <header className="flex items-center justify-between">
//         <h2 className="recent-transactions-label">Recent transactions</h2>
//         <Link
//           href={`/transaction-history/?id=${appwriteItemId}`}
//           className="view-all-btn"
//         >
//           View all
//         </Link>
//       </header>

//       <Tabs defaultValue={appwriteItemId} className="w-full">
//       <TabsList className="recent-transactions-tablist">
//           {accounts.map((account: Account) => (
//             <TabsTrigger key={account.id} value={account.appwriteItemId}>
//               <BankTabItem
//                 key={account.id}
//                 account={account}
//                 appwriteItemId={appwriteItemId}
//               />
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         {accounts.map((account: Account) => (
//           <TabsContent
//             value={account.appwriteItemId}
//             key={account.id}
//             className="space-y-4"
//           >
//             <BankInfo 
//               account={account}
//               appwriteItemId={appwriteItemId}
//               type="full"
//             />

//             <TransactionsTable transactions={currentTransactions} />
            

//             {totalPages > 1 && (
//               <div className="my-4 w-full">
//                 <Pagination totalPages={totalPages} page={page} />
//               </div>
//             )}
//           </TabsContent>
//         ))}
//       </Tabs>
//     </section>
//   )
// }

// export default RecentTransactions


'use client';

import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from './BankTabItem'
import BankInfo from './BankInfo'
import TransactionsTable from './TransactionsTable'
import { Pagination } from './Pagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, History } from 'lucide-react'

const RecentTransactions = ({
  accounts,
  transactions = [],
  appwriteItemId,
  page = 1,
}: RecentTransactionsProps) => {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )

  return (
    <Card className="recent-transactions border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-500" />
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Transactions
          </CardTitle>
        </div>
        <Link
          href={`/transaction-history/?id=${appwriteItemId}`}
          className="group flex items-center gap-1 text-sm font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
        >
          View all
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </CardHeader>

      <CardContent className="pt-6">
        <Tabs defaultValue={appwriteItemId} className="w-full">
          <TabsList className="recent-transactions-tablist bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
            {accounts.map((account: Account) => (
              <TabsTrigger 
                key={account.id} 
                value={account.appwriteItemId}
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded-lg transition-all"
              >
                <BankTabItem
                  key={account.id}
                  account={account}
                  appwriteItemId={appwriteItemId}
                />
              </TabsTrigger>
            ))}
          </TabsList>

          {accounts.map((account: Account) => (
            <TabsContent
              value={account.appwriteItemId}
              key={account.id}
              className="space-y-6"
            >
              <BankInfo 
                account={account}
                appwriteItemId={appwriteItemId}
                type="full"
              />

              <div className="overflow-x-auto">
                <TransactionsTable transactions={currentTransactions} />
              </div>
              
              {totalPages > 1 && (
                <div className="mt-6 w-full">
                  <Pagination totalPages={totalPages} page={page} />
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default RecentTransactions