'use client';

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import CustomInput from './CustomInput';
import { authFormSchema } from '@/lib/utils';
import { Loader2, Sparkles, Waves, Shield, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/actions/user.actions';
import PlaidLink from './PlaidLink';

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ''
    },
  })
   
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      if(type === 'sign-up') {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
          email: data.email,
          password: data.password
        }

        const newUser = await signUp(userData);
        setUser(newUser);
      }

      if(type === 'sign-in') {
        const response = await signIn({
          email: data.email,
          password: data.password,
        })

        if(response) router.push('/')
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center p-4">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      
      {/* Cyan glow orbs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000" />
      
      {/* Floating waves */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[200px] opacity-5">
        <Waves className="w-full h-full text-cyan-400" />
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-xl">        
        <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-cyan-500/20 shadow-2xl p-8 md:p-10">
          {/* Header section */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-cyan-400 p-2 rounded-full">
                  <Image 
                    src="/icons/logo.svg"
                    width={34}
                    height={34}
                    alt="SkyRise logo"
                    className="invert "
                  />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Sky<span className="text-cyan-400">Rise</span>
              </h1>
            </Link>
            
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {user 
                ? 'Connect your bank'
                : type === 'sign-in'
                  ? 'Welcome back'
                  : 'Start your journey'
              }
            </h2>
            <p className="text-slate-400 text-sm">
              {user 
                ? 'Link your accounts to see your financial future'
                : type === 'sign-in'
                  ? 'Secure access to your financial dashboard'
                  : 'Join the future of digital banking'
              }
            </p>
          </div>

          {user ? (
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-sky-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition" />
                <div className="relative bg-slate-800/90 rounded-2xl p-8 text-center border border-cyan-500/20">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-sky-400 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Final step!</h3>
                  <p className="text-slate-400 text-sm mb-6">Link your bank account to unlock your financial dashboard</p>
                  <PlaidLink user={user} variant="primary" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {type === 'sign-up' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <CustomInput 
                          control={form.control} 
                          name='firstName' 
                          label="First Name" 
                          placeholder='John' 
                        />
                        <CustomInput 
                          control={form.control} 
                          name='lastName' 
                          label="Last Name" 
                          placeholder='Doe' 
                        />
                      </div>
                      <CustomInput 
                        control={form.control} 
                        name='address1' 
                        label="Address" 
                        placeholder='123 Main St' 
                      />
                      <CustomInput 
                        control={form.control} 
                        name='city' 
                        label="City" 
                        placeholder='New York' 
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <CustomInput 
                          control={form.control} 
                          name='state' 
                          label="State" 
                          placeholder='NY' 
                        />
                        <CustomInput 
                          control={form.control} 
                          name='postalCode' 
                          label="Postal Code" 
                          placeholder='10001' 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <CustomInput 
                          control={form.control} 
                          name='dateOfBirth' 
                          label="Date of Birth" 
                          placeholder='1990-01-01' 
                        />
                        <CustomInput 
                          control={form.control} 
                          name='ssn' 
                          label="SSN" 
                          placeholder='1234' 
                        />
                      </div>
                    </>
                  )}

                  <CustomInput 
                    control={form.control} 
                    name='email' 
                    label="Email" 
                    placeholder='hello@example.com' 
                  />

                  <CustomInput 
                    control={form.control} 
                    name='password' 
                    label="Password" 
                    placeholder='••••••••' 
                  />

                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="relative w-full h-12 bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-600 hover:to-sky-500 text-white font-medium rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 group overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {type === 'sign-in' ? 'Sign In' : 'Create Account'}
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Button>
                </form>
              </Form>

              {/* Security badge */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
                <Shield size={14} className="text-cyan-400" />
                <span>256-bit encryption • Bank-level security</span>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-slate-900 text-slate-400">New to SkyRise?</span>
                </div>
              </div>

              <footer className="text-center">
                <Link 
                  href={type === 'sign-in' ? '/sign-up' : '/sign-in'} 
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors group"
                >
                  {type === 'sign-in' ? 'Create an account' : 'Sign in to existing'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </footer>
            </>
          )}
        </div>

        {/* Bottom decorative elements */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full blur-sm" />
      </div>
    </section>
  )
}

export default AuthForm