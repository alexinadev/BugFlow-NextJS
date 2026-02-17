'use client'

import type { EnvironmentDetails } from '@/types'

export function detectEnvironment(): EnvironmentDetails {
  if (typeof window === 'undefined') {
    return {
      browser: 'Unknown',
      browserVersion: 'Unknown',
      os: 'Unknown',
      osVersion: 'Unknown',
      deviceType: 'Desktop',
      screenResolution: 'Unknown',
      windowSize: 'Unknown',
    }
  }

  const ua = navigator.userAgent
  const { width, height } = window.screen
  const { innerWidth, innerHeight } = window

  // Detect browser
  let browser = 'Unknown'
  let browserVersion = 'Unknown'

  if (ua.includes('Firefox')) {
    browser = 'Firefox'
    browserVersion = ua.match(/Firefox\/(\d+\.?\d*)/)?.[1] || 'Unknown'
  } else if (ua.includes('Edg/')) {
    browser = 'Edge'
    browserVersion = ua.match(/Edg\/(\d+\.?\d*)/)?.[1] || 'Unknown'
  } else if (ua.includes('Chrome')) {
    browser = 'Chrome'
    browserVersion = ua.match(/Chrome\/(\d+\.?\d*)/)?.[1] || 'Unknown'
  } else if (ua.includes('Safari')) {
    browser = 'Safari'
    browserVersion = ua.match(/Version\/(\d+\.?\d*)/)?.[1] || 'Unknown'
  } else if (ua.includes('Opera') || ua.includes('OPR')) {
    browser = 'Opera'
    browserVersion = ua.match(/(?:Opera|OPR)\/(\d+\.?\d*)/)?.[1] || 'Unknown'
  }

  // Detect OS
  let os = 'Unknown'
  let osVersion = 'Unknown'

  if (ua.includes('Windows NT 10')) {
    os = 'Windows'
    osVersion = '10/11'
  } else if (ua.includes('Windows NT 6.3')) {
    os = 'Windows'
    osVersion = '8.1'
  } else if (ua.includes('Windows NT 6.2')) {
    os = 'Windows'
    osVersion = '8'
  } else if (ua.includes('Windows NT 6.1')) {
    os = 'Windows'
    osVersion = '7'
  } else if (ua.includes('Mac OS X')) {
    os = 'macOS'
    osVersion = ua.match(/Mac OS X (\d+[._]\d+[._]?\d*)/)?.[1]?.replace(/_/g, '.') || 'Unknown'
  } else if (ua.includes('Android')) {
    os = 'Android'
    osVersion = ua.match(/Android (\d+\.?\d*)/)?.[1] || 'Unknown'
  } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
    os = 'iOS'
    osVersion = ua.match(/OS (\d+[._]\d+[._]?\d*)/)?.[1]?.replace(/_/g, '.') || 'Unknown'
  } else if (ua.includes('Linux')) {
    os = 'Linux'
    osVersion = 'Unknown'
  }

  // Detect device type
  let deviceType: 'Mobile' | 'Desktop' | 'Tablet' = 'Desktop'
  
  if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) {
    deviceType = 'Tablet'
  } else if (/iPhone|Android|webOS|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua)) {
    deviceType = 'Mobile'
  }

  return {
    browser,
    browserVersion,
    os,
    osVersion,
    deviceType,
    screenResolution: `${width}x${height}`,
    windowSize: `${innerWidth}x${innerHeight}`,
  }
}