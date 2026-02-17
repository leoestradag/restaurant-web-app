"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "@/components/cart-item"
import { useCart } from "@/lib/cart-context"
import { useTable } from "@/lib/table-context"

import { useRouter } from "next/navigation"

export default function CartPage() {
  const router = useRouter()
  const { items, subtotal, tax, total } = useCart()
  const { tableNumber } = useTable()
  const [menuUrl, setMenuUrl] = useState<string | null>(null)

  useEffect(() => {
    // Recuperar el accessId del restaurante para volver al menú correcto
    if (typeof window !== "undefined") {
      const accessId = localStorage.getItem("restaurant-access-id")
      if (accessId) {
        setMenuUrl(`/restaurant/${accessId}${tableNumber ? `?table=${tableNumber}` : ""}`)
      }
    }
  }, [tableNumber])

  const handleBack = () => {
    if (menuUrl) {
      router.push(menuUrl)
    } else {
      // Si no hay URL del menú (ej. acceso directo/refresh sin historial), intentar volver atrás
      // Si history.length > 2 significa que hay historial para volver.
      if (window.history.length > 2) {
        router.back()
      } else {
        // Fallback final al home si no hay nada más
        router.push("/")
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Go back to menu</span>
          </Button>
          <h1 className="font-semibold text-lg text-foreground">Your Order</h1>
        </div>
      </header>

      <main className="px-4 py-4 pb-60">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium text-foreground">
              Your cart is empty
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add some delicious items to get started
            </p>
            <Button asChild className="mt-6">
              <Link href={menuUrl || "/"}>Browse Menu</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          {/* Glassmorphism panel */}
          <div className="bg-background/80 backdrop-blur-xl border-t shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] pb-8 pt-4 px-6 rounded-t-3xl">
            <div className="max-w-md mx-auto space-y-4">

              {/* Resumen de carrito colapsable - Más sutil */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm text-muted-foreground/80">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground/80">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total Destacado */}
              <div className="flex justify-between items-end pt-2 border-t border-border/50">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total a pagar</span>
                  <span className="text-3xl font-bold text-foreground tracking-tight">${total.toFixed(2)}</span>
                </div>
                <Button className="w-full h-14 text-lg font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 rounded-xl max-w-[50%]" asChild>
                  <Link href="/payment">
                    Pay Now
                    <span className="ml-2 opacity-80">→</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
