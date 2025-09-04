import React from 'react'

// Uses public/logo.png so you don't need to import the image
export default function AuthLayout({ heading, subheading, children }) {
  return (
    <div className="min-h-screen bg-wealth-paper text-wealth-ink">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-0">
        {/* Left hero panel */}
        <div className="hidden lg:flex relative items-center p-10">
          <div className="absolute inset-0 rounded-r-[40px] bg-gradient-to-br from-emerald-200/60 via-teal-100/40 to-indigo-100/40" />
          <div className="absolute inset-0 rounded-r-[40px] ring-1 ring-black/5" />
          <div className="relative z-10 max-w-md ml-6">
            <div className="flex items-center gap-3 mb-8">
              <img src="/logo.png" alt="WealthEdge logo" className="h-10 w-10 rounded-full object-cover shadow-sm ring-1 ring-black/5" />
              <div className="text-2xl font-semibold tracking-tight">WealthEdge</div>
            </div>
            <h1 className="text-3xl font-semibold leading-tight mb-4">{heading}</h1>
            <p className="text-wealth-slate leading-relaxed mb-8">
              {subheading}
            </p>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-[6px] inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span>Track daily expenses with clean summaries</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[6px] inline-block h-2 w-2 rounded-full bg-indigo-500" />
                <span>See spending by category and over time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[6px] inline-block h-2 w-2 rounded-full bg-amber-500" />
                <span>Log investing contributions and progress</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right form card */}
        <div className="flex items-center justify-center px-6 py-12 lg:px-10">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
              {children}
            </div>
            <div className="mt-6 text-center text-xs text-wealth-slate">
              © {new Date().getFullYear()} WealthEdge
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
