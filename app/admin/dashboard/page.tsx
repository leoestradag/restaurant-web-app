"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, TrendingUp, ShoppingBag, Package, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRestaurant } from "@/lib/restaurant-context"
import { restaurant } from "@/lib/data"

interface Order {
  id: string
  tableNumber: number | null
  status: string
  subtotal: number
  tax: number
  tip: number
  total: number
  paymentMethod: string | null
  paymentStatus: string
  createdAt: string
  itemCount: number
}

interface DailyStats {
  totalRevenue: number
  totalOrders: number
  totalItems: number
}

export default function DashboardPage() {
  const { restaurant: restaurantContext } = useRestaurant()
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<DailyStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalItems: 0,
  })
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  // For now, we'll use a mock restaurant ID. In production, get from auth context
  const restaurantId = "mock-restaurant-id"

  useEffect(() => {
    fetchOrders()
  }, [selectedDate])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/orders?restaurant_id=${restaurantId}&date=${selectedDate}`
      )
      const data = await response.json()

      if (response.ok) {
        setOrders(data.orders || [])
        setStats(data.stats || { totalRevenue: 0, totalOrders: 0, totalItems: 0 })
      } else {
        console.error("Error fetching orders:", data.error)
        // For development, use mock data
        setOrders([])
        setStats({ totalRevenue: 0, totalOrders: 0, totalItems: 0 })
      }
    } catch (error) {
      console.error("Error:", error)
      // For development, use mock data
      setOrders([])
      setStats({ totalRevenue: 0, totalOrders: 0, totalItems: 0 })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold">Dashboard Financiero</h1>
              <p className="text-xs text-muted-foreground">
                Gestión financiera y reportes del restaurante
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
          </div>
        </div>
      </header>

      <main className="px-4 py-6 pb-24 max-w-6xl mx-auto">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 rounded-lg bg-green-500 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ingresos del Día</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.totalOrders} {stats.totalOrders === 1 ? "orden" : "órdenes"}
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Órdenes del Día</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalOrders}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.totalItems} {stats.totalItems === 1 ? "item" : "items"} vendidos
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <div className="h-12 w-12 rounded-lg bg-purple-500 flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Items Vendidos</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalItems}
              </p>
              <p className="text-xs text-muted-foreground">
                Promedio:{" "}
                {stats.totalOrders > 0
                  ? (stats.totalItems / stats.totalOrders).toFixed(1)
                  : "0"}{" "}
                por orden
              </p>
            </div>
          </Card>
        </div>

        {/* Orders List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Órdenes del Día</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(selectedDate).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Cargando órdenes...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay órdenes para esta fecha</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          Orden #{order.id.slice(0, 8)}
                        </span>
                        {order.tableNumber && (
                          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                            Mesa {order.tableNumber}
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            order.paymentStatus === "completed"
                              ? "bg-green-100 text-green-700"
                              : order.paymentStatus === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.paymentStatus === "completed"
                            ? "Pagado"
                            : order.paymentStatus === "pending"
                            ? "Pendiente"
                            : order.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatDate(order.createdAt)}</span>
                      <span>•</span>
                      <span>
                        {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                      </span>
                      {order.paymentMethod && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{order.paymentMethod}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(order.total)}
                    </p>
                    {order.tip > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Propina: {formatCurrency(order.tip)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}

