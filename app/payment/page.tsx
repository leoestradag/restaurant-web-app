"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronDown, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useTable } from "@/lib/table-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EqualSplitModal } from "@/components/equal-split-modal"
import { ItemSplitModal } from "@/components/item-split-modal"
import { cn } from "@/lib/utils"

// Restaurant surcharge percentage (configurable)
const RESTAURANT_SURCHARGE_RATE = 0.03 // 3%

const tipOptions = [
  { id: "18", label: "18%", value: 0.18, emoji: "😊" },
  { id: "20", label: "20%", value: 0.2, emoji: "😘" },
  { id: "25", label: "25%", value: 0.25, emoji: "❤️" }, // 'popular' is now dynamic
]

const RESTAURANT_ACCESS_ID_KEY = "restaurant-access-id"
// Key to store our aggregated tip counts in localStorage
const TIP_COUNTS_KEY = "smartable-tip-counts"

export default function PaymentPage() {
  const { items, subtotal, tax, total, clearCart } = useCart()
  const { tableNumber } = useTable()
  const [showSplitOptions, setShowSplitOptions] = useState(false)
  const [showEqualSplit, setShowEqualSplit] = useState(false)
  const [showItemSplit, setShowItemSplit] = useState(false)
  const [selectedTip, setSelectedTip] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [restaurantAccessId, setRestaurantAccessId] = useState<string | null>(null)

  // State para almacenar quién es el tip popular basado en datos
  const [popularTipId, setPopularTipId] = useState<string>("20") // Default to 20% if no data

  // Obtener el accessId del restaurante desde localStorage o desde la URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Intentar obtener desde localStorage
      const storedAccessId = localStorage.getItem(RESTAURANT_ACCESS_ID_KEY)
      if (storedAccessId) {
        setRestaurantAccessId(storedAccessId)
      } else {
        // Si no está en localStorage, intentar obtenerlo desde la URL de referencia
        // o desde document.referrer
        const referrer = document.referrer
        if (referrer) {
          try {
            const url = new URL(referrer)
            const pathParts = url.pathname.split("/")
            const accessIdIndex = pathParts.indexOf("restaurant")
            if (accessIdIndex !== -1 && pathParts[accessIdIndex + 1]) {
              const accessId = pathParts[accessIdIndex + 1]
              setRestaurantAccessId(accessId)
              localStorage.setItem(RESTAURANT_ACCESS_ID_KEY, accessId)
            }
          } catch (e) {
            // Si no se puede parsear, usar un valor por defecto o null
          }
        }
      }

      // Cargar la popularidad de propinas desde localStorage
      try {
        const storedTipCounts = localStorage.getItem(TIP_COUNTS_KEY)
        if (storedTipCounts) {
          const counts: Record<string, number> = JSON.parse(storedTipCounts)

          // Encontrar el tip con mayor count
          let maxCount = -1
          let mostPopularId = "20"

          Object.entries(counts).forEach(([id, count]) => {
            if (count > maxCount) {
              maxCount = count
              mostPopularId = id
            }
          })

          setPopularTipId(mostPopularId)
        }
      } catch (e) {
        console.error("Error parsing tip counts from localStorage:", e)
      }
    }
  }, [])

  // Guardar propina cuando el usuario completa el pago
  const recordTipSelection = () => {
    if (!selectedTip) return

    try {
      const storedTipCounts = localStorage.getItem(TIP_COUNTS_KEY)
      const counts: Record<string, number> = storedTipCounts ? JSON.parse(storedTipCounts) : {}

      counts[selectedTip] = (counts[selectedTip] || 0) + 1
      localStorage.setItem(TIP_COUNTS_KEY, JSON.stringify(counts))
    } catch (e) {
      console.error("Error saving tip counts:", e)
    }
  }

  // Calculate restaurant surcharge
  const restaurantSurcharge = subtotal * RESTAURANT_SURCHARGE_RATE
  const totalWithSurcharge = subtotal + restaurantSurcharge
  const finalTax = totalWithSurcharge * (tax / subtotal) || 0
  const baseTotal = totalWithSurcharge + finalTax

  // Calculate tip
  const tipValue = selectedTip
    ? tipOptions.find((t) => t.id === selectedTip)?.value || 0
    : 0
  const tipAmount = baseTotal * tipValue
  const finalTotal = baseTotal + tipAmount

  const handlePayOrSplit = () => {
    setShowSplitOptions(true)
  }

  const handleDirectPayment = async () => {
    setIsProcessing(true)
    recordTipSelection() // Registra el tip antes de pagar
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setIsComplete(true)
    clearCart()
  }

  // Construir la URL de regreso al menú
  const getMenuUrl = () => {
    if (restaurantAccessId) {
      return `/restaurant/${restaurantAccessId}${tableNumber ? `?table=${tableNumber}` : ""}`
    }
    // Fallback: intentar obtener desde la URL actual o usar "/"
    return "/"
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-4 text-center">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          ¡Pago Exitoso!
        </h1>
        <p className="text-muted-foreground mb-8">
          Gracias por tu orden. ¡Disfruta tu comida!
        </p>
        <Button asChild>
          <Link href={getMenuUrl()}>Volver al Menú</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Volver al carrito</span>
            </Link>
          </Button>
          <h1 className="font-semibold text-lg text-foreground">Pago</h1>
        </div>
      </header>

      <main className="px-4 py-6 pb-32 max-w-2xl mx-auto">
        {/* Table Info */}
        {tableNumber && (
          <div className="mb-4 text-sm text-muted-foreground">
            Mesa {tableNumber}
          </div>
        )}

        {/* Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-foreground">Por pagar</h2>
            <span className="text-2xl font-bold text-foreground">
              ${(selectedTip ? finalTotal : baseTotal).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between py-2 border-b border-border/40"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {item.quantity}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {item.name}
                  </span>
                </div>
              </div>
              <span className="text-sm font-medium text-foreground ml-4">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Restaurant Surcharge */}
        <div className="mb-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                % Restaurant Surcharge
              </span>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Ver detalles del cargo"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <span className="text-sm font-medium text-foreground">
              ${restaurantSurcharge.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Taxes */}
        <div className="mb-6">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">% Taxes</span>
            <span className="text-sm font-medium text-foreground">
              ${finalTax.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Tip Section */}
        {items.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base font-semibold text-foreground mb-4">
              Da las gracias con una propina
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {tipOptions.map((tip) => {
                const isSelected = selectedTip === tip.id
                return (
                  <button
                    key={tip.id}
                    type="button"
                    onClick={() => setSelectedTip(tip.id)}
                    className={cn(
                      "relative p-4 rounded-lg border-2 transition-all",
                      isSelected
                        ? "border-black bg-gray-100"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                  >
                    {tip.id === popularTipId && (
                      <div className="absolute -top-2 left-2 bg-black text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        POPULAR
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-2">
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <Check className="h-5 w-5 text-black" />
                        </div>
                      )}
                      <span className="text-2xl">{tip.emoji}</span>
                      <span className="text-base font-semibold text-foreground">
                        {tip.label}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
            {selectedTip && (
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Importe de la propina:
                  </span>
                  <span className="font-medium text-foreground">
                    ${tipAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-foreground">Estás pagando:</span>
                  <span className="text-foreground">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security & Terms Section */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <p className="text-sm font-medium text-foreground">
              Paga de forma segura con Smartable
            </p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Al utilizar la aplicación Smartable, estás dando tu consentimiento a
            nuestros <span className="font-semibold">términos de uso</span> y{" "}
            <span className="font-semibold">política de privacidad</span>.
            Entiendes que tu información es procesada en nombre del restaurante y
            será compartida con ellos.
          </p>
        </div>

        {/* Pay or Split Button */}
        <Button
          className="w-full h-14 text-base font-semibold bg-black text-white hover:bg-black/90 rounded-lg"
          onClick={handlePayOrSplit}
          disabled={items.length === 0 || isProcessing}
        >
          {isProcessing ? "Procesando..." : "Pagar o dividir la cuenta"}
        </Button>
      </main>

      {/* Split Options Modal */}
      <Dialog open={showSplitOptions} onOpenChange={setShowSplitOptions}>
        <DialogContent className="sm:max-w-md p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-xl font-bold">
              Dividir la cuenta
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-3">
            <Button
              variant="outline"
              className="w-full h-16 text-base font-medium justify-start bg-white hover:bg-gray-50 border-2 rounded-lg"
              onClick={handleDirectPayment}
              disabled={isProcessing}
            >
              Pagar cuenta completa
            </Button>
            <Button
              variant="outline"
              className="w-full h-16 text-base font-medium justify-start bg-white hover:bg-gray-50 border-2 rounded-lg"
              onClick={() => {
                setShowSplitOptions(false)
                setShowItemSplit(true)
              }}
            >
              Pagar por artículo
            </Button>
            <Button
              variant="outline"
              className="w-full h-16 text-base font-medium justify-start bg-white hover:bg-gray-50 border-2 rounded-lg"
              onClick={() => {
                setShowSplitOptions(false)
                setShowEqualSplit(true)
              }}
            >
              Dividir la cuenta en partes iguales
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Equal Split Modal */}
      <EqualSplitModal
        open={showEqualSplit}
        onClose={() => setShowEqualSplit(false)}
        total={selectedTip ? finalTotal : baseTotal}
        onConfirm={async () => {
          setIsProcessing(true)
          recordTipSelection() // Registrar también en pagos divididos
          await new Promise((resolve) => setTimeout(resolve, 2000))
          setIsProcessing(false)
          setIsComplete(true)
          clearCart()
        }}
      />

      {/* Item Split Modal */}
      <ItemSplitModal
        open={showItemSplit}
        onClose={() => setShowItemSplit(false)}
        items={items}
        subtotal={subtotal}
        tax={finalTax}
        surcharge={restaurantSurcharge}
        onConfirm={async () => {
          setIsProcessing(true)
          recordTipSelection() // Registrar también en desglose de cuenta
          await new Promise((resolve) => setTimeout(resolve, 2000))
          setIsProcessing(false)
          setIsComplete(true)
          clearCart()
        }}
      />
    </div>
  )
}
