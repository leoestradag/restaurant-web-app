"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Minus, Plus, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Product } from "@/lib/data"
import { useCart } from "@/lib/cart-context"

interface ProductDetailModalProps {
  product: Product | null
  open: boolean
  onClose: () => void
}

export function ProductDetailModal({
  product,
  open,
  onClose,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const { addItem } = useCart()

  const handleClose = () => {
    setQuantity(1)
    onClose()
  }

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      toast.success(`${quantity}x ${product.name} agregado al carrito`, {
        description: "Puedes ver tu pedido en el carrito de compras",
        action: {
          label: "Ver carrito",
          onClick: () => router.push("/cart")
        }
      })
      handleClose()
    }
  }

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="relative aspect-video">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <DialogHeader className="px-4 pt-4">
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-6 space-y-4">
          <p className="text-muted-foreground">{product.description}</p>
          <p className="text-lg font-semibold text-foreground">
            ${product.price.toFixed(2)}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-transparent"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <span className="text-lg font-medium w-8 text-center text-foreground">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-transparent"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>
            <Button onClick={handleAddToCart} className="px-6">
              Add to cart - ${(product.price * quantity).toFixed(2)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
