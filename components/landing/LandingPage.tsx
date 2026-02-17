'use client'

import { Bug, Ticket, BarChart3, CheckCircle } from 'lucide-react'

interface LandingPageProps {
  onSignIn: () => void
}

export function LandingPage({ onSignIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BF</span>
              </div>
              <span className="text-xl font-semibold text-slate-900 dark:text-white">
                BugFlow
              </span>
            </div>
            <button
              onClick={onSignIn}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="h-24 w-24 bg-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Bug className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Report Bugs. Track Progress.{' '}
            <span className="text-blue-600">Get Results.</span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            BugFlow is a streamlined ticketing system that connects you directly with support teams. 
            Transform chaotic bug reports into structured, trackable tickets.
          </p>
          
          <button
            onClick={onSignIn}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors text-lg shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
            Everything you need to manage bug reports
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                <Ticket className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Easy Ticket Submission
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Submit detailed bug reports with environment detection, screenshots, and step-by-step reproduction guides.
              </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="h-14 w-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Real-time Tracking
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Monitor your ticket status in real-time. Get notifications when your bugs are being worked on or resolved.
              </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="h-14 w-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Fast Resolution
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Our streamlined workflow ensures your issues are addressed quickly with clear resolution summaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to streamline your bug reporting?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Sign in to start submitting and tracking your tickets.
          </p>
          <button
            onClick={onSignIn}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Sign In to BugFlow
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto text-center text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} BugFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}