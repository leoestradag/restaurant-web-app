"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { X, Plus, Sparkles, ShoppingBag } from "lucide-react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { useRestaurant } from "@/lib/restaurant-context"
import { Product } from "@/lib/data"

interface UpsellModalProps {
    isOpen: boolean
    onClose: () => void
    onContinueToPayment: () => void
}

export function UpsellModal({ isOpen, onClose, onContinueToPayment }: UpsellModalProps) {
    const router = useRouter()
    const { products } = useRestaurant()
    const { items, addItem } = useCart()
    const [recommendations, setRecommendations] = useState<Product[]>([])

    // Efecto para generar recomendaciones cada vez que se abre el modal
    useEffect(() => {
        if (isOpen) {
            // Filtrar IDs que ya están en el carrito
            const cartProductIds = new Set(items.map(item => item.id))

            // Separar postres y bebidas que no estén en el carrito
            const availableDesserts = products.filter(
                p => p.category === "desserts" && !cartProductIds.has(p.id)
            )
            const availableDrinks = products.filter(
                p => p.category === "drinks" && !cartProductIds.has(p.id)
            )

            // Revolver ambos arrays
            const shuffledDesserts = [...availableDesserts].sort(() => 0.5 - Math.random())
            const shuffledDrinks = [...availableDrinks].sort(() => 0.5 - Math.random())

            // Seleccionar hasta 2 postres y 1 bebida
            const selectedDesserts = shuffledDesserts.slice(0, 2)
            const selectedDrinks = shuffledDrinks.slice(0, 1)

            // Combinar y establecer recomendaciones
            const finalRecommendations = [...selectedDesserts, ...selectedDrinks]
            setRecommendations(finalRecommendations)
        }
    }, [isOpen, items, products])

    // Si no hay recomendaciones, solo procedemos directo al pago
    useEffect(() => {
        if (isOpen && recommendations.length === 0 && products.length > 0) {
            // Breve retraso para evitar ciclos infinitos en el render
            const timer = setTimeout(() => {
                onContinueToPayment()
            }, 0)
            return () => clearTimeout(timer)
        }
    }, [isOpen, recommendations.length, products.length, onContinueToPayment])

    if (recommendations.length === 0) {
        return null // No renderizar nada si no hay upsells (pasará directo al pago)
    }

    const handleAdd = (product: Product) => {
        addItem(product)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none bg-background/95 backdrop-blur-xl shadow-2xl rounded-3xl" showCloseButton={false}>
                <div className="relative">
                    {/* Header decorativo */}
                    <div className="bg-primary/5 p-6 pb-4 border-b border-primary/10">
                        <div className="absolute top-4 right-4 z-10">
                            <Button variant="ghost" size="icon" className="rounded-full bg-background/50 hover:bg-background/80" onClick={onClose}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <DialogTitle className="flex items-center gap-2 text-xl font-semibold mb-1">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Wait, one more thing!
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            These pair perfectly with your order.
                        </p>
                    </div>

                    <div className="p-4 overflow-y-auto max-h-[60vh]">
                        <div className="grid grid-cols-1 gap-3">
                            {recommendations.map((item) => (
                                <Card key={item.id} className="flex gap-3 p-3 items-center border-border/50 hover:bg-accent/30 transition-colors shadow-sm rounded-2xl overflow-hidden">
                                    <div className="relative h-16 w-16 shrink-0 aspect-square rounded-xl overflow-hidden bg-muted">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                                        <p className="text-primary font-semibold text-sm">${item.price.toFixed(2)}</p>
                                    </div>

                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="shrink-0 h-9 rounded-full px-4 gap-1.5 font-medium shadow-sm"
                                        onClick={() => handleAdd(item)}
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add</span>
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="p-5 border-t bg-background/50 backdrop-blur-sm">
                        <Button
                            className="w-full h-14 text-base font-semibold shadow-lg shadow-primary/20 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                            onClick={onContinueToPayment}
                        >
                            Continue to Payment
                            <span className="ml-2 opacity-80">→</span>
                        </Button>
                        <button
                            className="w-full text-center text-sm font-medium text-muted-foreground mt-4 hover:text-foreground transition-colors"
                            onClick={onClose}
                        >
                            No thanks, back to cart
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
