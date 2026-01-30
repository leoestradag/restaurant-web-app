"use client"

import { useState } from "react"
import { ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { CartItem } from "@/lib/data"

interface ItemSplitModalProps {
  open: boolean
  onClose: () => void
  items: CartItem[]
  subtotal: number
  tax: number
  surcharge: number
  onConfirm: () => Promise<void>
}

export function ItemSplitModal({
  open,
  onClose,
  items,
  subtotal,
  tax,
  surcharge,
  onConfirm,
}: ItemSplitModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)

  const toggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const selectedItemsData = items.filter((item) => selectedItems.has(item.id))
  const selectedSubtotal = selectedItemsData.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const selectedSurcharge = selectedSubtotal * (surcharge / subtotal) || 0
  const selectedTax = (selectedSubtotal + selectedSurcharge) * (tax / subtotal) || 0
  const selectedTotal = selectedSubtotal + selectedSurcharge + selectedTax

  const handleConfirm = async () => {
    if (selectedItems.size === 0) return
    setIsProcessing(true)
    await onConfirm()
    setIsProcessing(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -ml-2"
              onClick={onClose}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <DialogTitle className="text-xl font-bold flex-1">
              Pagar por artículo
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Items List */}
          <div className="space-y-2">
            {items.map((item) => {
              const isSelected = selectedItems.has(item.id)
              const itemTotal = item.price * item.quantity
              return (
                <Card
                  key={item.id}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "border-2 border-black bg-black/5"
                      : "border border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {item.quantity}
                        </span>
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${item.price.toFixed(2)} × {item.quantity} = $
                        {itemTotal.toFixed(2)}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="ml-4 h-6 w-6 rounded-full bg-black flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Selected Items Summary */}
          {selectedItems.size > 0 && (
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${selectedSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cargo del restaurante</span>
                <span className="font-medium">${selectedSurcharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Impuestos</span>
                <span className="font-medium">${selectedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-base font-semibold">Total</span>
                <span className="text-xl font-bold">
                  ${selectedTotal.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <Button
            className="w-full h-12 text-base font-semibold bg-black text-white hover:bg-black/90 rounded-lg"
            onClick={handleConfirm}
            disabled={isProcessing || selectedItems.size === 0}
          >
            {isProcessing
              ? "Procesando..."
              : `Pagar $${selectedTotal.toFixed(2)}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

