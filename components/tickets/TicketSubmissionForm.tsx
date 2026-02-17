'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2, Loader2 } from 'lucide-react'
import { detectEnvironment } from '@/lib/env-detection'
import type { EnvironmentDetails, Severity } from '@/types'

interface TicketSubmissionFormProps {
  onSubmit: (data: TicketFormData) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
  userName?: string
  userPhone?: string
}

export interface TicketFormData {
  title: string
  description: string
  stepsToReproduce: string[]
  severity: Severity
  userFullName: string
  userEmail: string
  environmentDetails: EnvironmentDetails
}

interface FormErrors {
  title?: string
  description?: string
  stepsToReproduce?: string
  severity?: string
  userEmail?: string
}

export function TicketSubmissionForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  userName = '',
  userPhone = '',
}: TicketSubmissionFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState<string[]>([''])
  const [severity, setSeverity] = useState<Severity>('minor')
  const [userFullName, setUserFullName] = useState(userName)
  const [userEmail, setUserEmail] = useState('')
  const [showEnvDetails, setShowEnvDetails] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const environmentDetails = useMemo(() => detectEnvironment(), [])

  const addStep = () => {
    setSteps([...steps, ''])
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index))
    }
  }

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required'
    }

    const validSteps = steps.filter(s => s.trim())
    if (validSteps.length === 0) {
      newErrors.stepsToReproduce = 'At least one step is required'
    }

    if (!userEmail.trim()) {
      newErrors.userEmail = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      newErrors.userEmail = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const validSteps = steps.filter(s => s.trim())

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      stepsToReproduce: validSteps,
      severity,
      userFullName: userFullName.trim(),
      userEmail: userEmail.trim(),
      environmentDetails,
    })
  }

  const severityOptions: { value: Severity; label: string; color: string }[] = [
    { value: 'blocking', label: 'Blocking', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    { value: 'major', label: 'Major', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
    { value: 'minor', label: 'Minor', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
    { value: 'suggestion', label: 'Suggestion', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Issue Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief description of the issue"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue in detail"
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
        )}
      </div>

      {/* Steps to Reproduce */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Steps to Reproduce <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <span className="flex-shrink-0 w-8 h-10 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-600 rounded-lg">
                {index + 1}
              </span>
              <input
                type="text"
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.stepsToReproduce && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stepsToReproduce}</p>
        )}
        <button
          type="button"
          onClick={addStep}
          className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <Plus className="h-4 w-4" />
          Add Step
        </button>
      </div>

      {/* Severity */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Severity
        </label>
        <div className="flex flex-wrap gap-2">
          {severityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSeverity(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                severity === option.value
                  ? option.color + ' ring-2 ring-offset-2 ring-blue-500'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Environment Details (Collapsible) */}
      <div>
        <button
          type="button"
          onClick={() => setShowEnvDetails(!showEnvDetails)}
          className="flex items-center justify-between w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-left"
        >
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Environment Details (Auto-detected)
          </span>
          {showEnvDetails ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </button>
        {showEnvDetails && environmentDetails && (
          <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Browser:</span>
              <span className="ml-2 text-slate-700 dark:text-slate-200">
                {environmentDetails.browser} {environmentDetails.browserVersion}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">OS:</span>
              <span className="ml-2 text-slate-700 dark:text-slate-200">
                {environmentDetails.os} {environmentDetails.osVersion}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Device:</span>
              <span className="ml-2 text-slate-700 dark:text-slate-200">
                {environmentDetails.deviceType}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Screen:</span>
              <span className="ml-2 text-slate-700 dark:text-slate-200">
                {environmentDetails.screenResolution}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 dark:text-slate-400">Window Size:</span>
              <span className="ml-2 text-slate-700 dark:text-slate-200">
                {environmentDetails.windowSize}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Your Name
          </label>
          <input
            id="fullName"
            type="text"
            value={userFullName}
            onChange={(e) => setUserFullName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="john@example.com"
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.userEmail ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
            }`}
          />
          {errors.userEmail && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.userEmail}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Bug Report'
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}