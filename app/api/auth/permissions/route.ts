import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPermissionsByRole } from '@/lib/rbac'
import type { AllowedRoles } from '@/lib/rbac'

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const permissions = getPermissionsByRole(user.role as AllowedRoles)

    return NextResponse.json({
      success: true,
      role: user.role,
      permissions,
    })
  } catch (error) {
    console.error('Permissions error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch permissions' },
      { status: 500 }
    )
  }
}
