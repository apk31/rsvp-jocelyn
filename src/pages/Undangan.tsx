import { useEffect, useState } from "react"
import { fetchGuests } from "../api"
import type { Guest } from "../types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faCircleInfo,faTriangleExclamation,faXmark,} from "@fortawesome/free-solid-svg-icons"

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debounced
}

/* =======================
   Status Badge
======================= */
function StatusBadge({ status }: { status?: string }) {
  const normalized = status?.toLowerCase()

  const base =
    "inline-flex items-center justify-center min-w-[90px] h-8 px-3 text-xs font-semibold rounded-full transition-all duration-300"

  if (normalized === "yes") {
    return (
      <span className={`${base} bg-green-100 text-green-700`}>
        ✔ Hadir
      </span>
    )
  }

  if (normalized === "no") {
    return (
      <span className={`${base} bg-red-100 text-red-700`}>
        ✖ Tidak Hadir
      </span>
    )
  }

  return (
    <span className={`${base} bg-yellow-100 text-yellow-700`}>
      No Info
    </span>
  )
}

/* =======================
   Skeleton Row (Premium Shimmer)
======================= */
function SkeletonRow() {
  return (
    <tr className="h-14">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="p-3">
          <div className="h-4 rounded skeleton-shimmer"></div>
        </td>
      ))}
    </tr>
  )
}
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
   Undangan Page
======================= */
export default function Undangan() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const debouncedSearch = useDebounce(search, 300)
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
      } catch (err) {
        console.error(err)
        setError("Gagal mengambil data undangan.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filtered = guests
    .filter((g) => {
      if (filter === "hadir") return g.rsvp?.toLowerCase() === "yes"
      if (filter === "tidak") return g.rsvp?.toLowerCase() === "no"
      if (filter === "noinfo") return !g.rsvp
      return true
    })
    .filter(g =>
      g.nama.toLowerCase().includes(debouncedSearch.toLowerCase()) || g.noUndangan.toString().includes(debouncedSearch)
    )
    .sort((a, b) => a.noUndangan - b.noUndangan)

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Total Result: <strong>{filtered.length}</strong> undangan</p>
      <h1 className="text-4xl font-bold">Daftar Undangan</h1>

      {error && <ErrorBanner message={error} />}
      <div className="space-y-4 overflow-hidden">
        {/* <Notification type="info">
          Undangan <strong>No. 4</strong> atas nama <strong>Ronald Tjoanda</strong><br></br>
          Undangan <strong>No. 26</strong> atas nama <strong>Ama Maria Margaretha</strong><br></br>
          Undangan <strong>No. 58</strong> atas nama <strong>Kimberly M.</strong><br></br>
          Undangan <strong>No. 113</strong> atas nama <strong>Ce Vina</strong><br></br>
          Undangan <strong>No. 125</strong> atas nama <strong>Ellaina</strong><br></br>
        </Notification> */}
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg w-full"
          placeholder="Cari nama atau nomor undangan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Semua</option>
          <option value="hadir">Hadir</option>
          <option value="tidak">Tidak Hadir</option>
          <option value="noinfo">Tanpa Info</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white dark:bg-slate-800 sticky top-0 z-10 shadow-sm">
            <tr>
              {/* <th className="p-3">ID Undangan</th> */}
              <th className="p-3">No Undangan</th>
              <th className="p-3">Nama</th>
              <th className="p-3">Valid For</th>
              <th className="p-3">RSVP</th>
              <th className="p-3">Meja</th>
              <th className="p-3">Person Hadir</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : (
              filtered.map((g) => (
                <tr
                  key={g.noUndangan}
                  className="h-14 border-b border-slate-200 dark:border-slate-700
                  hover:bg-slate-50 dark:hover:bg-slate-800
                  transition-all duration-300 animate-fadeIn"
                >
                  {/* <td className="p-3">{g.qrCode}</td> */}
                  <td className="p-3">{g.noUndangan}</td>
                  <td className="p-3">{g.nama}</td>
                  <td className="p-3">{g.person}</td>
                  <td className="text-center align-middle">
                    <StatusBadge status={g.rsvp} />
                  </td>
                  <td className="p-3">{g.grup || "-"}</td>
                  <td className="p-3">{g.attending}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}