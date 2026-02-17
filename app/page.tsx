'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth'
import { LandingPage } from '@/components/landing'
import { LoginDialog } from '@/components/auth'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.push('/portal')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to /portal
  }

  return (
    <>
      <LandingPage onSignIn={() => setShowLoginDialog(true)} />
      <LoginDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)} 
      />
    </>
  )
}