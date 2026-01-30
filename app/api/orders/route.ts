import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurant_id")
    const date = searchParams.get("date") // Format: YYYY-MM-DD
    const period = searchParams.get("period") || "day" // day, month, year

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurant_id is required" },
        { status: 400 }
      )
    }

    // Calculate date range based on period
    let startDate: string
    let endDate: string
    const targetDate = date ? new Date(date) : new Date()

    if (period === "day") {
      const dateStr = date || targetDate.toISOString().split("T")[0]
      startDate = `${dateStr} 00:00:00`
      endDate = `${dateStr} 23:59:59`
    } else if (period === "month") {
      const year = targetDate.getFullYear()
      const month = targetDate.getMonth()
      startDate = `${year}-${String(month + 1).padStart(2, "0")}-01 00:00:00`
      const lastDay = new Date(year, month + 1, 0).getDate()
      endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")} 23:59:59`
    } else if (period === "year") {
      const year = targetDate.getFullYear()
      startDate = `${year}-01-01 00:00:00`
      endDate = `${year}-12-31 23:59:59`
    } else {
      // Default to day
      const dateStr = targetDate.toISOString().split("T")[0]
      startDate = `${dateStr} 00:00:00`
      endDate = `${dateStr} 23:59:59`
    }

    // Get orders for the day
    const orders = (await sql`
      SELECT 
        o.id,
        o.table_number,
        o.status,
        o.subtotal,
        o.tax,
        o.tip,
        o.total,
        o.payment_method,
        o.payment_status,
        o.created_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.restaurant_id = ${restaurantId}
        AND o.created_at >= ${startDate}::timestamp
        AND o.created_at <= ${endDate}::timestamp
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `) as any[]

    // Calculate period totals
    const periodStats = orders.reduce(
      (acc, order) => {
        acc.totalRevenue += Number(order.total) || 0
        acc.totalOrders += 1
        acc.totalItems += Number(order.item_count) || 0
        return acc
      },
      {
        totalRevenue: 0,
        totalOrders: 0,
        totalItems: 0,
      }
    )

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        tableNumber: order.table_number,
        status: order.status,
        subtotal: Number(order.subtotal),
        tax: Number(order.tax),
        tip: Number(order.tip),
        total: Number(order.total),
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        createdAt: order.created_at,
        itemCount: Number(order.item_count),
      })),
      stats: periodStats,
      period,
    })
  } catch (error: any) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: error.message || "Error fetching orders" },
      { status: 500 }
    )
  }
}

