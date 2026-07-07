import { HashRouter, Routes, Route, NavLink, useLocation } from "react-router-dom"
import React, { useEffect, useState } from "react"
import Dashboard from "./pages/Dashboard"
import Undangan from "./pages/Undangan"
import AttendanceDashboard from "./pages/AttendanceDashboard"
import AttendanceList from "./pages/AttendanceList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons"

function PageWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div
      key={location.pathname}
      className="animate-pageFade"
    >
      {children}
    </div>
  )
}
function App() {
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [loading, setLoading] = useState(true)
const [fadeOut, setFadeOut] = useState(false)
const [showNav, setShowNav] = useState(true)
const [lastScrollY, setLastScrollY] = useState(0)

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY

    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      setShowNav(false) // scroll down → hide
    } else {
      setShowNav(true) // scroll up → show
    }

    setLastScrollY(currentScrollY)
  }

  window.addEventListener("scroll", handleScroll)
  return () => window.removeEventListener("scroll", handleScroll)
}, [lastScrollY])

useEffect(() => {
  const timer1 = setTimeout(() => {
    setFadeOut(true)   // mulai fade
  }, 600)

  const timer2 = setTimeout(() => {
    setLoading(false)  // hilangkan splash
  }, 1000)

  return () => {
    clearTimeout(timer1)
    clearTimeout(timer2)
  }
}, [])

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "dark") {
      document.documentElement.classList.add("dark")
      setDark(true)
    }
  }, [])

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
    setDark(!dark)
  }
  if (loading) {
  return (
    <div
      className={`
        h-screen flex items-center justify-center
        bg-gradient-to-br 
        from-[#f6f1e7] via-[#f3eadc] to-[#efe4d2]
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
        transition-opacity duration-500
        ${fadeOut ? "opacity-0" : "opacity-100"}
      `}
    >
      <div className="text-center space-y-6">
        <div className="text-3xl font-bold tracking-wide">
          RSVP Jocelyn Dashboard
        </div>

        {/* Progress Bar */}
        <div className="w-40 h-1 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-green-500 animate-progress"></div>
        </div>
      </div>
    </div>
  )
}
  return (
  <HashRouter>
    
    <div className="
  pt-20 min-h-screen flex flex-col
  bg-gradient-to-br 
  from-[#f6f1e7] via-[#f3eadc] to-[#efe4d2]
  dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
">

      {/* ===== NAVBAR ===== */}
      <nav
  className={`
    fixed top-0 left-0 w-full z-50
    transition-transform duration-300
    ${showNav ? "translate-y-0" : "-translate-y-full"}
    border-b border-slate-300 dark:border-slate-800
    backdrop-blur-md bg-white/80 dark:bg-slate-950/80
  `}
>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <h1 className="text-xl font-bold">
            RSVP Jocelyn
          </h1>

          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" className="hover:text-blue-500">
              Dashboard
            </NavLink>

            <NavLink to="/undangan" className="hover:text-blue-500">
              Undangan
            </NavLink>
            <NavLink to="/attendance-dashboard" onClick={() => setOpen(false)} className="block">
              Attendance Dashboard
            </NavLink>
            <NavLink to="/attendance-list" onClick={() => setOpen(false)} className="block">
              Attendance List
            </NavLink>
            <button
  onClick={toggleTheme}
  className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center gap-2"
>
  <FontAwesomeIcon icon={dark ? faMoon : faSun} />
  {dark ? "Dark" : "Light"}
</button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setOpen(prev => !prev)}
          >
            ☰
          </button>
        </div>

        {open && (
          <div className="md:hidden px-6 pb-4 space-y-3">
            <NavLink to="/" onClick={() => setOpen(false)} className="block">
              Dashboard
            </NavLink>
            <NavLink to="/undangan" onClick={() => setOpen(false)} className="block">
              Undangan
            </NavLink>
            <NavLink to="/attendance-dashboard" onClick={() => setOpen(false)} className="block">
              Attendance Dashboard
            </NavLink>
            <NavLink to="/attendance-list" onClick={() => setOpen(false)} className="block">
              Attendance List
            </NavLink>
            <button
  onClick={toggleTheme}
  className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center gap-2"
>
  <FontAwesomeIcon icon={dark ? faMoon : faSun} />
  {dark ? "Dark" : "Light"}
</button>
          </div>
        )}
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-grow">
  <PageWrapper>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/undangan" element={<Undangan />} />
      <Route path="/attendance-dashboard" element={<AttendanceDashboard />} />
      <Route path="/attendance-list" element={<AttendanceList />} />
    </Routes>
  </PageWrapper>
</main>

      {/* ===== FOOTER ===== */}
      <footer className="text-center py-4 
                         text-sm text-slate-500 
                         border-t border-slate-300 
                         dark:border-slate-800">
        © Penguin Berjalan 2018–2026
      </footer>

    </div>
  </HashRouter>
)
}

export default React.memo(App)
