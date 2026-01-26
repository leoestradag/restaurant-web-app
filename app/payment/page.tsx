"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Check, Users, Zap, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { SplitPayment } from "@/components/split-payment"
import { usePaymentMethods } from "@/lib/payment-methods-context"
import { SavedPaymentMethods } from "@/components/saved-payment-methods"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const paymentMethods = [
  { id: "card", name: "Credit Card", icon: CreditCard },
  { id: "apple", name: "Apple Pay", icon: () => <ApplePayIcon /> },
  { id: "google", name: "Google Pay", icon: () => <GooglePayIcon /> },
]

const tipOptions = [
  { id: "0", label: "No tip", value: 0 },
  { id: "5", label: "5%", value: 0.05 },
  { id: "10", label: "10%", value: 0.1 },
  { id: "15", label: "15%", value: 0.15 },
]

function ApplePayIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.72 7.82c-.12-.13-1.4-.75-1.4-2.38 0-1.65 1.28-2.44 1.34-2.48a3.06 3.06 0 0 0-2.37-1.28c-1-.1-2.05.6-2.58.6-.53 0-1.35-.58-2.22-.57a3.26 3.26 0 0 0-2.75 1.68c-1.18 2.04-.3 5.06.84 6.72.56.81 1.23 1.72 2.1 1.69.85-.03 1.17-.55 2.2-.55 1.02 0 1.31.55 2.2.53.91-.01 1.48-.82 2.03-1.64.64-.93.9-1.84.92-1.88-.02-.01-1.77-.68-1.78-2.7l-.53.26z" />
      <path d="M14.42 2.78c.46-.56.77-1.34.69-2.12-.67.03-1.47.45-1.95 1-.43.49-.81 1.29-.71 2.05.75.06 1.51-.38 1.97-.93z" />
    </svg>
  )
}

function GooglePayIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  )
}

interface SplitPerson {
  id: string
  name: string
  items: { itemId: string; quantity: number }[]
}

export default function PaymentPage() {
  const router = useRouter()
  const { items, subtotal, tax, total, clearCart } = useCart()
  const { savedMethods, getDefaultMethod } = usePaymentMethods()
  const [selectedPayment, setSelectedPayment] = useState("card")
  const [selectedTip, setSelectedTip] = useState("10")
  const [customTip, setCustomTip] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [splitPayment, setSplitPayment] = useState(false)
  const [splitPeople, setSplitPeople] = useState<SplitPerson[]>([])
  const [useSavedMethod, setUseSavedMethod] = useState(false)
  const [selectedSavedMethod, setSelectedSavedMethod] = useState<string | null>(null)
  const [showSavedMethods, setShowSavedMethods] = useState(false)

  const tipValue = selectedTip === "custom" 
    ? Number.parseFloat(customTip) || 0 
    : tipOptions.find(t => t.id === selectedTip)?.value || 0

  const tipAmount = selectedTip === "custom" 
    ? Number.parseFloat(customTip) || 0 
    : subtotal * tipValue

  const grandTotal = total + tipAmount

  // Calcular totales por persona si está dividido
  const calculatePersonTotal = (person: SplitPerson): number => {
    const personItems = items.filter((item) =>
      person.items.some((pi) => pi.itemId === item.id)
    )
    const personSubtotal = personItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const personTax = personSubtotal * (tax / subtotal) || 0
    const personTip = personSubtotal * tipValue
    return personSubtotal + personTax + personTip
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setIsComplete(true)
    clearCart()
  }

  const handleQuickPay = async () => {
    const defaultMethod = getDefaultMethod()
    if (!defaultMethod) return

    setSelectedSavedMethod(defaultMethod.id)
    setUseSavedMethod(true)
    setSelectedPayment(defaultMethod.type)
    await handlePayment()
  }

  const defaultMethod = getDefaultMethod()
  const hasQuickPay = defaultMethod !== null && !splitPayment

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your order. Enjoy your meal!
        </p>
        <Button asChild>
          <Link href="/">Back to Menu</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Link>
          </Button>
          <h1 className="font-semibold text-lg text-foreground">Payment</h1>
        </div>
      </header>

      <main className="px-4 py-4 pb-32 space-y-6">
        {/* Quick Pay Button */}
        {hasQuickPay && (
          <section>
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Pago Rápido</h3>
                </div>
                <Dialog open={showSavedMethods} onOpenChange={setShowSavedMethods}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Settings className="h-4 w-4" />
                      Gestionar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Métodos de Pago Guardados</DialogTitle>
                    </DialogHeader>
                    <SavedPaymentMethods />
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Paga con tu método predeterminado: {defaultMethod?.name}
              </p>
              <Button
                className="w-full"
                onClick={handleQuickPay}
                disabled={isProcessing || subtotal === 0}
                size="lg"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isProcessing ? "Procesando..." : `Pagar $${grandTotal.toFixed(2)}`}
              </Button>
            </Card>
          </section>
        )}

        {/* Split Payment Toggle */}
        <section>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="split-payment" className="text-base font-medium cursor-pointer">
                    Dividir cuenta
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Divide la cuenta entre varias personas
                  </p>
                </div>
              </div>
              <Switch
                id="split-payment"
                checked={splitPayment}
                onCheckedChange={setSplitPayment}
              />
            </div>
          </Card>
        </section>

        {/* Split Payment Section */}
        {splitPayment && (
          <section>
            <SplitPayment
              items={items}
              subtotal={subtotal}
              tax={tax}
              onSplitChange={setSplitPeople}
            />
          </section>
        )}

        {/* Payment Methods */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-foreground">Payment Method</h2>
            {savedMethods.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUseSavedMethod(!useSavedMethod)}
                className="text-xs"
              >
                {useSavedMethod ? "Usar método nuevo" : "Usar método guardado"}
              </Button>
            )}
          </div>
          
          {useSavedMethod && savedMethods.length > 0 ? (
            <div className="space-y-2">
              {savedMethods.map((method) => {
                const Icon = paymentMethods.find((m) => m.id === method.type)?.icon || CreditCard
                return (
                  <Card
                    key={method.id}
                    className={cn(
                      "p-4 cursor-pointer transition-colors",
                      selectedSavedMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => {
                      setSelectedSavedMethod(method.id)
                      setSelectedPayment(method.type)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        selectedSavedMethod === method.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}>
                        <Icon />
                      </div>
                      <div className="flex-1">
                        <span className={cn(
                          "font-medium",
                          selectedSavedMethod === method.id
                            ? "text-primary"
                            : "text-foreground"
                        )}>
                          {method.name}
                        </span>
                        {method.last4 && (
                          <p className="text-xs text-muted-foreground">
                            •••• {method.last4}
                          </p>
                        )}
                      </div>
                      {selectedSavedMethod === method.id && (
                        <Check className="h-5 w-5 text-primary ml-auto" />
                      )}
                      {method.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Predeterminado
                        </Badge>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
          <div className="space-y-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              return (
                <Card
                  key={method.id}
                  className={cn(
                    "p-4 cursor-pointer transition-colors",
                    selectedPayment === method.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      selectedPayment === method.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      <Icon />
                    </div>
                    <span className={cn(
                      "font-medium",
                      selectedPayment === method.id
                        ? "text-primary"
                        : "text-foreground"
                    )}>
                      {method.name}
                    </span>
                    {selectedPayment === method.id && (
                      <Check className="h-5 w-5 text-primary ml-auto" />
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Tip Selection */}
        <section>
          <h2 className="font-medium text-foreground mb-3">Add a Tip</h2>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {tipOptions.map((tip) => (
              <button
                key={tip.id}
                type="button"
                onClick={() => {
                  setSelectedTip(tip.id)
                  setCustomTip("")
                }}
                className={cn(
                  "py-3 px-2 rounded-xl text-sm font-medium transition-colors",
                  selectedTip === tip.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {tip.label}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-tip" className="text-sm text-muted-foreground">
              Or enter a custom amount
            </Label>
            <Input
              id="custom-tip"
              type="number"
              placeholder="$0.00"
              value={customTip}
              onChange={(e) => {
                setCustomTip(e.target.value)
                setSelectedTip("custom")
              }}
              className="h-12"
            />
          </div>
        </section>

        {/* Order Summary */}
        <section>
          <h2 className="font-medium text-foreground mb-3">
            {splitPayment ? "Resumen por Persona" : "Order Summary"}
          </h2>
          {splitPayment && splitPeople.length > 0 ? (
            <div className="space-y-3">
              {splitPeople.map((person) => {
                const personTotal = calculatePersonTotal(person)
                return (
                  <Card key={person.id} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-foreground">{person.name}</span>
                      <span className="font-semibold text-lg">
                        ${personTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {person.items.length} {person.items.length === 1 ? "item" : "items"}
                    </div>
                  </Card>
                )
              })}
              <Card className="p-4 bg-muted/50">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-foreground">Total General</span>
                  <span className="text-foreground">${grandTotal.toFixed(2)}</span>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tip</span>
                <span className="text-foreground">${tipAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">${grandTotal.toFixed(2)}</span>
              </div>
            </Card>
          )}
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        {splitPayment && splitPeople.length > 0 ? (
          <div className="space-y-2">
            {splitPeople.map((person) => {
              const personTotal = calculatePersonTotal(person)
              return (
                <Button
                  key={person.id}
                  className="w-full h-12 text-base"
                  onClick={handlePayment}
                  disabled={isProcessing || personTotal === 0}
                  variant="outline"
                >
                  {isProcessing
                    ? "Processing..."
                    : `${person.name}: Pay $${personTotal.toFixed(2)}`}
                </Button>
              )
            })}
          </div>
        ) : (
          <Button
            className="w-full h-12 text-base"
            onClick={handlePayment}
            disabled={isProcessing || subtotal === 0}
          >
            {isProcessing ? "Processing..." : `Pay $${grandTotal.toFixed(2)}`}
          </Button>
        )}
      </div>
    </div>
  )
}
