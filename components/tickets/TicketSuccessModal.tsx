'use client'

import { CheckCircle, Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'

interface TicketSuccessModalProps {
  isOpen: boolean
  ticketId: string
  onClose: () => void
  onViewTickets: () => void
}

export function TicketSuccessModal({
  isOpen,
  ticketId,
  onClose,
  onViewTickets,
}: TicketSuccessModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const trackingLink = `${window.location.origin}/status?ticket=${ticketId}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(trackingLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Ticket Submitted!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Your bug report has been submitted successfully. Save your tracking ID to check the status later.
          </p>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Ticket ID</p>
            <p className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
              {ticketId}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Tracking Link</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={trackingLink}
                readOnly
                className="flex-1 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                title="Copy link"
              >
                {copied ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onViewTickets}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              View My Tickets
              <ExternalLink className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}