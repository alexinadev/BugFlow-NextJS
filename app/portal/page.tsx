'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth'
import { UserPortalDashboard } from '@/components/portal'
import type { Ticket } from '@/types'

export default function PortalPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  // Fetch tickets
  const fetchTickets = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/tickets')
      const data = await response.json()
      
      if (data.success) {
        setTickets(data.tickets)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchTickets()
    }
  }, [user, fetchTickets])

  const handleViewTicket = (ticketId: string) => {
    router.push(`/status?ticket=${ticketId}`)
  }

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  return (
    <UserPortalDashboard
      tickets={tickets}
      isLoading={isLoading}
      onRefresh={fetchTickets}
      onViewTicket={handleViewTicket}
    />
  )
}