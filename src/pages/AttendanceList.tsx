import { useEffect, useState } from "react"
import { fetchAttendanceData } from "../atApi"
import EventCountdown from "../components/EventCountdown"

function EventSplash({ beforeEvent }: { beforeEvent: boolean }) {
  return (
    <div className="w-full 
      flex 
      flex-col 
      items-center 
      justify-center 
      text-center 
      px-4 
      animate-fadeIn
      min-h-[calc(100vh-160px)]">

      {/* Loading Dots */}
      <div className="flex space-x-2 mb-4">
        <div className="w-3 h-3 bg-zinc-500 rounded-full dot"></div>
        <div className="w-3 h-3 bg-zinc-500 rounded-full dot"></div>
        <div className="w-3 h-3 bg-zinc-500 rounded-full dot"></div>
      </div>

      {beforeEvent ? (
        <>
          <h2 className="text-base md:text-xl font-semibold mb-6">
            Akan di update ketika event selesai
          </h2>

          <div className="w-full flex justify-center overflow-hidden">
  <div className="w-full max-w-full flex justify-center">
    <div className="scale-[0.68] sm:scale-75 md:scale-90 lg:scale-100 origin-top">
      <EventCountdown />
    </div>
  </div>
</div>
        </>
      ) : (
        <>
          <h2 className="text-base md:text-xl font-semibold mb-4">
            Waiting for Update from admin
          </h2>

          <p className="text-sm text-slate-500 loading-dots">
            Checking data
          </p>
        </>
      )}
    </div>
  )
}

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debounced
}

export default function AttendanceList() {
  const [data, setData] = useState<any>(null)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  const debounced = useDebounce(search, 300)
    
  useEffect(() => {
    const load = async () => {
        setLoading(true)
      const res = await fetchAttendanceData()
      setData(res)
      setLoading(false)
    }

    load()
  }, [])
if (loading) {
  return (
    <div className="h-[70vh] flex items-center justify-center">
      <div className="animate-pulse text-xl font-semibold">
        Loading Attendance List...
      </div>
    </div>
  )
}
  if (!data) return null

  if (data.status !== "ready") {
    return <EventSplash beforeEvent={data.beforeEvent} />
  }

  const filtered = data.guests
    .filter((g: any) => {
      if (filter === "hadir") return g.isAttended
      if (filter === "belum") return !g.isAttended
      return true
    })
    .filter((g: any) =>
      g.nama.toLowerCase().includes(debounced.toLowerCase()) || g.noUndangan.toString().includes(debounced)
    )

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold">Attendance List</h1>

      <p className="text-sm text-slate-500">
        Total Result: <strong>{filtered.length}</strong>
      </p>

      <div className="flex gap-4">
        <input
          className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 w-full"
          placeholder="Cari nama atau nomor undangan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Semua</option>
          <option value="hadir">Hadir</option>
          <option value="belum">Belum Hadir</option>
        </select>
      </div>

      <div className="overflow-x-auto">
  <table className="w-full text-left border-collapse">
    <thead className="bg-white dark:bg-slate-800 sticky top-0 z-10 shadow-sm">
      <tr>
        <th className="p-3">No</th>
        <th className="p-3">Nama</th>
        <th className="p-3">Status</th>
        <th className="p-3">Check In</th>
      </tr>
    </thead>
    <tbody>
      {filtered.map((g: any) => (
        <tr
          key={g.noUndangan}
          className="h-14 border-b border-slate-200 dark:border-slate-700
                     hover:bg-slate-50 dark:hover:bg-slate-800
                     transition-all duration-300 animate-fadeIn"
        >
          <td className="p-3">{g.noUndangan}</td>
          <td className="p-3">{g.nama}</td>

          <td className="text-center">
            <span
              className={`inline-flex items-center justify-center min-w-[110px] h-8 px-3 text-xs font-semibold rounded-full
                ${
                  g.isAttended
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {g.isAttended ? "✔ Sudah Datang" : "⏳ Belum Datang"}
            </span>
          </td>

          <td className="p-3">
            {g.checkInTime || "-"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  )
}