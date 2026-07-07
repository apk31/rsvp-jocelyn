import { useEffect, useState } from "react"
import { fetchAttendanceData } from "../atApi"
import AnimatedNumber from "../components/AnimatedNumber"
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

// function WaitingScreen({ beforeEvent }: { beforeEvent: boolean }) {
//   return (
//     <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
//       <div className="w-16 h-16 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
//       <p className="text-xl font-semibold animate-pulse">
//         {beforeEvent
//           ? "Akan di update ketika event selesai"
//           : "Waiting for Update from admin..."}
//       </p>
//     </div>
//   )
// }

export default function AttendanceDashboard() {
  const [data, setData] = useState<any>(null)
const [loading, setLoading] = useState(true)


useEffect(() => {
  const load = async () => {
    try {
    setLoading(true)
    const res = await fetchAttendanceData()
    // console.log("API RESPONSE", res)
    setData(res)
    } catch (err) {
    //   console.log("API ERROR")
    } finally {
      setLoading(false)
    }
  }

  load()
  
}, [])

if (loading) {
  return (
    <div className="h-[70vh] flex items-center justify-center">
      <div className="animate-pulse text-xl font-semibold">
        Loading Dashboard...
      </div>
    </div>
  )
}

  if (!data) return null

  if (data.status === "no_file") {
    return <EventSplash beforeEvent={data.beforeEvent} />
  }

  if (data.status === "error") {
    return <div className="p-10 text-red-500">Error loading attendance</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold">Attendance Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Undangan" value={data.total} />
        <Card title="Sudah Hadir" value={data.attendedCount} color="green" />
        <Card
          title="Belum Hadir"
          value={data.total - data.attendedCount}
          color="red"
        />
      </div>
    </div>
  )
}

function Card({ title, value, color }: any) {
  const colorMap: any = {
    green: "text-green-500",
    red: "text-red-500",
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
      <p className="text-sm text-slate-500 uppercase">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${colorMap[color] || ""}`}>
        <AnimatedNumber value={value} />
      </p>
    </div>
  )
}