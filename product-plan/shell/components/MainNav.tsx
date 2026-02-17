import { Menu } from 'lucide-react'

interface MainNavProps {
  navigationItems: Array<{ label: string; href: string; isActive?: boolean }>
  onNavigate?: (href: string) => void
}

export function MainNav({ navigationItems, onNavigate }: MainNavProps) {
  return (
    <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">BF</span>
              </div>
              <span className="text-xl font-semibold text-slate-900 dark:text-white">
                BugFlow
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => onNavigate?.(item.href)}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  item.isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="pt-2 pb-3 space-y-1 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          {navigationItems.map((item) => (
            <button
              key={item.href}
              onClick={() => onNavigate?.(item.href)}
              className={`block pl-3 pr-4 py-2 text-base font-medium w-full text-left transition-colors duration-200 ${
                item.isActive
                  ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'border-l-4 border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
