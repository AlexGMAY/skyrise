import AnimatedCounter from './AnimatedCounter';
import DoughnutChart from './DoughnutChart';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Wallet, Banknote } from 'lucide-react';

const TotalBalanceBox = ({
  accounts = [], totalBanks, totalCurrentBalance
}: TotalBalanceBoxProps) => {
  return (
    <Card className="total-balance bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Doughnut Chart Section */}
          <div className="relative">
            <div className="total-balance-chart">
              <DoughnutChart accounts={accounts} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <Wallet className="w-6 h-6 text-cyan-500 mx-auto mb-1" />
                <span className="text-xs font-semibold text-gray-500">{totalBanks}</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
              <div className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-cyan-500" />
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Bank Accounts :
                </h2>
              </div>
              <p className="text-2xl pl-2 font-bold text-gray-900 dark:text-white">
                {totalBanks}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Current Balance
                </p>
              </div>
              <div className="total-balance-amount">
                <AnimatedCounter amount={totalCurrentBalance} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Updated just now
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TotalBalanceBox