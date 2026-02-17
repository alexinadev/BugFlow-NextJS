'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'
import { useAuth } from '@/components/auth'
import { TicketSubmissionForm, TicketSuccessModal, type TicketFormData } from '@/components/tickets'

export default function SubmitPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [ticketId, setTicketId] = useState('')

  const handleSubmit = async (data: TicketFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setTicketId(result.ticket.id)
        setShowSuccess(true)
      } else {
        alert(result.error || 'Failed to submit ticket')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to submit ticket. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/portal')
  }

  const handleViewTickets = () => {
    setShowSuccess(false)
    router.push('/portal')
  }

  const handleCloseSuccess = () => {
    setShowSuccess(false)
    // Reset form by refreshing the page
    router.refresh()
  }

  if (!user) {
    return null // Will be handled by middleware
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Submit a Ticket
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Report a bug or request support
            </p>
          </div>
        </div>

        <TicketSubmissionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          userName={user.name}
          userPhone={user.phone}
        />
      </div>

      <TicketSuccessModal
        isOpen={showSuccess}
        ticketId={ticketId}
        onClose={handleCloseSuccess}
        onViewTickets={handleViewTickets}
      />
    </div>
  )
}