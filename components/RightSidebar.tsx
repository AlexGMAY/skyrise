'use client';

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import BankCard from './BankCard'
import { countTransactionCategories } from '@/lib/utils'
import Category from './Category'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, User, Mail, CreditCard, TrendingUp } from 'lucide-react'
import PlaidLink from './PlaidLink';

const RightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {
  const categories: CategoryCount[] = countTransactionCategories(transactions);

  return (
    <aside className="right-sidebar lg:sticky lg:top-6 space-y-6">
      {/* Profile Card */}
      <Card className="rounded-sm border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="profile-banner h-24 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
        <CardContent className="relative pt-7 pb-6">
          <div className="profile absolute -top-12 left-2">
            <div className="profile-img w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                <span className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  {user?.firstName?.[0] || 'U'}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-details -mt-6">
            <h2 className='profile-name '>
              {user?.firstName} {user?.lastName}
            </h2>
            <div className="flex items-center gap-2 text-gray-500">
              <Mail className="w-4 h-4" />
              <p className="text-sm">
                {user?.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banks Section */}
      <Card className="rounded-sm border-gray-200 dark:border-gray-800 shadow-lg">
        <CardContent className="p-6">
          <div className="flex w-full justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Banks</h3>
            </div>
            <Link href="/" className="group flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
              <Plus className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Add Bank
              </h3>
            </Link>
          </div>

          {banks?.length > 0 ? (
            <div className="relative flex flex-col items-center justify-center min-h-[280px]">
              <div className='relative z-10 w-full transform hover:scale-105 transition-transform duration-300'>
                <BankCard 
                  key={banks[0].$id}
                  account={banks[0]}
                  userName={`${user?.firstName} ${user?.lastName}`}
                  showBalance={false}
                />
              </div>
              {banks[1] && (
                <div className="absolute -bottom-6 right-0 z-0 w-[95%] opacity-80 hover:opacity-100 transition-opacity">
                  <BankCard 
                    key={banks[1].$id}
                    account={banks[1]}
                    userName={`${user?.firstName} ${user?.lastName}`}
                    showBalance={false}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="pb-4 text-gray-500 dark:text-gray-400">No banks connected yet</p>
              <PlaidLink 
                user={user}
                variant={"primary"}                   
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Categories */}
      {categories.length > 0 && (
        <Card className="border-gray-200 dark:border-gray-800 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-cyan-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Categories</h3>
            </div>

            <div className='space-y-4'>
              {categories.map((category, index) => (
                <div key={category.name} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <Category category={category} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </aside>
  )
}

export default RightSidebar