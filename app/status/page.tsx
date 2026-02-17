'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth'
import { TicketTrackingDashboard } from '@/components/status'
import type { Ticket } from '@/types'

interface StatusHistoryItem {
  id: string
  status: string
  changedAt: string
  changedBy: string
  reason?: string
}

export default function StatusPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const ticketId = searchParams.get('ticket')

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

  const handleViewHistory = async (ticketId: string): Promise<StatusHistoryItem[]> => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}/history`)
      const data = await response.json()
      
      if (data.success) {
        return data.history
      }
      return []
    } catch (error) {
      console.error('Fetch history error:', error)
      return []
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  return (
    <TicketTrackingDashboard
      tickets={tickets}
      isLoading={isLoading}
      onRefresh={fetchTickets}
      onViewHistory={handleViewHistory}
    />
  )
}