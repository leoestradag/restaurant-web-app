"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ShoppingBag, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "@/components/cart-item"
import { useCart } from "@/lib/cart-context"
import { useTable } from "@/lib/table-context"
import { UpsellModal } from "@/components/upsell-modal"

import { useRouter } from "next/navigation"

export default function CartPage() {
  const router = useRouter()
  const { items, subtotal, tax, total } = useCart()
  const { tableNumber } = useTable()
  const [menuUrl, setMenuUrl] = useState<string | null>(null)
  const [showUpsell, setShowUpsell] = useState(false)

  useEffect(() => {
    // Recuperar el accessId del restaurante para volver al menú correcto
    if (typeof window !== "undefined") {
      let accessId = localStorage.getItem("restaurant-access-id")

      // Si no hay ID en storage, intentar recuperar del referrer
      if (!accessId && document.referrer) {
        try {
          const url = new URL(document.referrer)
          const pathParts = url.pathname.split("/")
          const accessIdIndex = pathParts.indexOf("restaurant")
          if (accessIdIndex !== -1 && pathParts[accessIdIndex + 1]) {
            accessId = pathParts[accessIdIndex + 1]
            // Guardar para uso futuro
            localStorage.setItem("restaurant-access-id", accessId)
          }
        } catch (e) {
          // Ignorar errores de parsing
        }
      }

      if (accessId) {
        setMenuUrl(`/restaurant/${accessId}${tableNumber ? `?table=${tableNumber}` : ""}`)
      }
    }
  }, [tableNumber])

  const handleBack = () => {
    // Intentar obtener el ID del restaurante directamente de localStorage
    const accessId = localStorage.getItem("restaurant-access-id")

    if (accessId) {
      router.push(`/restaurant/${accessId}${tableNumber ? `?table=${tableNumber}` : ""}`)
    } else if (document.referrer && document.referrer.includes('/restaurant/')) {
      // Si no hay ID pero venimos de un restaurante (referrer), volver ahí
      router.push(document.referrer)
    } else {
      // Fallback específico para el restaurante del usuario si todo lo demás falla
      // Esto asegura que "la flechita azul" siempre lleve al menú aunque se pierda el contexto
      router.push("/restaurant/SMARTABLE-REST-001")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Volver al menú</span>
          </Button>
          <h1 className="font-semibold text-lg text-foreground">Tu Pedido</h1>
        </div>
      </header>

      <main className="px-4 py-4 pb-60">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium text-foreground">
              Tu pedido está vacío
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Agrega algunos deliciosos platillos para empezar
            </p>
            <Button asChild className="mt-6">
              <Link href={menuUrl || "/"}>Ver Menú</Link>
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

              {/* Tiempo estimado de preparación (ETA) */}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-orange-800 uppercase tracking-wide">Tiempo Estimado</p>
                  <p className="text-sm text-orange-950 font-semibold gap-1 flex items-center">
                    15 - 20 minutos <span className="text-xs text-orange-600/80 font-normal">a tu mesa</span>
                  </p>
                </div>
              </div>

              {/* Resumen de carrito colapsable - Más sutil */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-sm text-muted-foreground/80">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground/80">
                  <span>Impuestos (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total Destacado */}
              <div className="flex justify-between items-end pt-2 border-t border-border/50">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total a pagar</span>
                  <span className="text-3xl font-bold text-foreground tracking-tight">${total.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full h-14 text-lg font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 rounded-xl max-w-[50%]"
                  onClick={() => setShowUpsell(true)}
                >
                  Pagar Ahora
                  <span className="ml-2 opacity-80">→</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <UpsellModal
        isOpen={showUpsell}
        onClose={() => setShowUpsell(false)}
        onContinueToPayment={() => router.push("/payment")}
      />
    </div>
  )
}
