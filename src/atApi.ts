import Papa from "papaparse"
import type { Guest } from "./types"
import { fetchGuests } from "./api"

export interface AttendanceRow {
  or_code: string
  nama: string
  datetime: string
}

const EVENT_TIME = new Date("2026-05-01T18:00:00+07:00")

export async function fetchAttendanceData() {
  try {
    
    const res = await fetch("/attendance.csv")
const text = await res.text()
// console.log("Raw attendance.csv content:", text.slice(0, 500)) // Log sebagian isi untuk debugging

// Jika HTML fallback
if (
  text.includes("<!DOCTYPE") ||
  text.includes("<html") ||
  !text.includes("or_code")
) {
  return {
    status: "no_file" as const,
    beforeEvent: new Date() < EVENT_TIME,
  }
}

    if (!res.ok) {
      return {
        status: "no_file" as const,
        beforeEvent: new Date() < EVENT_TIME,
      }
    }

    const csvText = text
    // console.log("csv:",csvText)
    if (!csvText.trim()) {
      return {
        status: "no_file" as const,
        beforeEvent: new Date() < EVENT_TIME,
      }
    }

    const parsed = Papa.parse<AttendanceRow>(csvText, {
      header: true,
      skipEmptyLines: true,
    })

    const attendanceRows = parsed.data.filter(
  (r) => r.or_code && r.or_code.trim() !== ""
)

    const guestRes = await fetchGuests()
    const guests = guestRes.data

    const attendedSet = new Set(
  attendanceRows
    .filter((r) => r.or_code && r.or_code.trim() !== "")
    .map((r) => r.or_code.trim())
)

    const merged = guests.map((g) => {
      const match = attendanceRows.find(
        (a) => a.or_code === g.qrCode
      )

      return {
        ...g,
        isAttended: attendedSet.has(g.qrCode),
        checkInTime: match?.datetime || null,
      }
    })

    return {
      status: "ready" as const,
      guests: merged,
      attendedCount: attendedSet.size,
      total: guests.length,
    }
  } catch {
    return {
      status: "error" as const,
    }
  }
}