import { useEffect, useState } from "react"
import { fetchGuests } from "../api"
import type { Guest } from "../types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faCircleInfo,faTriangleExclamation,faXmark,} from "@fortawesome/free-solid-svg-icons"
import AnimatedNumber from "../components/AnimatedNumber"
/* =======================
   Animated Counter
======================= */
// function AnimatedNumber({ value }: { value: number }) {
//   const [display, setDisplay] = useState(0)

//   useEffect(() => {
//     let start = 0
//     const duration = 800
//     const increment = value / (duration / 16)

//     const counter = setInterval(() => {
//       start += increment
//       if (start >= value) {
//         start = value
//         clearInterval(counter)
//       }
//       setDisplay(Math.floor(start))
//     }, 16)

//     return () => clearInterval(counter)
//   }, [value])

//   return <span>{display}</span>
// }

/* =======================
   Notification
======================= */
function Notification({
  type = "info",
  children,
}: {
  type?: "info" | "warning"
  children: React.ReactNode
}) {
  const [visible, setVisible] = useState(true)
  const [closing, setClosing] = useState(false)

  if (!visible) return null

  const styles = {
    info: "bg-blue-100 text-blue-800 border-blue-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  }

  const iconMap = {
    info: faCircleInfo,
    warning: faTriangleExclamation,
  }

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => setVisible(false), 300)
  }

  return (
    <div
      className={`
        relative flex items-start gap-4
        p-4 rounded-2xl border shadow-sm
        transition-all duration-300
        ${styles[type]}
        ${closing ? "animate-slideUp" : "animate-slideDown"}
      `}
    >
      <div className="text-lg mt-1 shrink-0">
        <FontAwesomeIcon icon={iconMap[type]} />
      </div>

      <div className="flex-1 text-sm md:text-base">{children}</div>

      <button
        onClick={handleClose}
        className="opacity-60 hover:opacity-100 transition"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  )
}

/* =======================
   Skeleton Card
======================= */
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
      <div className="h-4 w-24 rounded mb-4 skeleton-shimmer"></div>
      <div className="h-8 w-16 rounded skeleton-shimmer"></div>
    </div>
  )
}

/* =======================
   Error Banner
======================= */
function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-2xl flex items-center gap-3 animate-slideDown">
      <FontAwesomeIcon icon={faTriangleExclamation} />
      <span className="font-semibold">{message}</span>
    </div>
  )
}

/* =======================
   Dashboard
======================= */
export default function Dashboard() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [lastUpdate, setLastUpdate] = useState("")
  const [lastInput, setLastInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError("")

        const res = await fetchGuests()

        if (!res.data.length) {
          throw new Error("Data kosong")
        }

        setGuests(res.data)
        setLastUpdate(res.lastUpdated)
        setLastInput(res.lastInput)
      } catch (err) {
        console.error(err)
        setError("Gagal mengambil data dari Google Sheets.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const totalUndangan = guests.length
  const hadir = guests.filter((g) => g.rsvp?.toLowerCase() === "yes")
  const tidakHadir = guests.filter((g) => g.rsvp?.toLowerCase() === "no")
  const noInfo = guests.filter((g) => !g.rsvp)

  const totalOrang = guests.reduce((acc, g) => acc + g.person, 0)
  const totalHadirOrang = guests.reduce((acc, g) => acc + g.attending, 0)

  return (
    <div className="max-w-6xl mx-auto p-6 pb-24 space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Latest Input : {lastInput}</p>
      {error && <ErrorBanner message={error} />}

      <div className="space-y-4 overflow-hidden">
        <Notification type="info">
          Akses data undangan dengan memilih menu{" "}
          <strong>Undangan</strong> di navbar (☰) kanan atas 👆.
        </Notification>
        <Notification type="info">
          Gunakan opsi ganti tema <strong>Dark</strong> atau <strong>Light</strong> sesuai preferensi anda di navbar (☰) kanan atas 👆.
        </Notification>

        {/* <Notification type="info">
          Mohon untuk RSVP ulang ke WhatsApp CS RSVP supaya dapat dilakukan pengiriman QR.<br></br>
          kepada <strong>Undangan No. 28 (Bita)</strong> 
        </Notification> */}

        {/* <Notification type="warning">
          Duplikat ditemukan. Undangan dengan nama <strong>Emira ( ID 22 & 91 )</strong>.
          Apakah orang sama atau berbeda ? Mohon infonya ke EO atau CS RSVP.
        </Notification>  */}
      </div>

      {/* 4 CARD ATAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <Card title="Total Undangan" value={totalUndangan} />
            <Card title="Hadir" value={hadir.length} color="green" />
            <Card title="Tidak Hadir" value={tidakHadir.length} color="red" />
            <Card title="Tanpa Info" value={noInfo.length} color="yellow" />
          </>
        )}
      </div>

      {/* 2 CARD BAWAH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <Card title="Total Orang Diundang" value={totalOrang} />
            <Card
              title="Total Orang Hadir"
              value={totalHadirOrang}
              color="green"
            />
          </>
        )}
      </div>

      {/* Footer Section */}
      <div className="pt-6 border-t border-slate-300 dark:border-slate-700 space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Last Sync with Invitation Site Database : {lastUpdate}
        </p>

        <a
          href="https://wa.me/+6287872568324"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow-md transition-all duration-300"
        >
          💬 Hubungi CS RSVP (WhatsApp)
        </a>
      </div>

      <a
        href="https://wa.me/+6287872568324"
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 sm:hidden"
      >
        💬 Chat CS
      </a>
    </div>
  )
}

/* =======================
   Card Component
======================= */
function Card({ title, value, color }: any) {
  const colorMap: any = {
    green: "text-green-500",
    red: "text-red-500",
    yellow: "text-yellow-500",
  }

  return (
    <div className="bg-white dark:bg-slate-800 min-h-[100px] md:min-h-[120px] rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98]">
      <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {title}
      </p>

      <p
        className={`text-2xl md:text-3xl font-bold mt-2 ${
          colorMap[color] || ""
        }`}
      >
        <AnimatedNumber value={value} />
      </p>
    </div>
  )
}