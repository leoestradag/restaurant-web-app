"use client"

import { useState } from "react"
import { ArrowLeft, Minus, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EqualSplitModalProps {
  open: boolean
  onClose: () => void
  total: number
  onConfirm: () => Promise<void>
}

export function EqualSplitModal({
  open,
  onClose,
  total,
  onConfirm,
}: EqualSplitModalProps) {
  const [payingFor, setPayingFor] = useState(1)
  const [totalPeople, setTotalPeople] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const amountPerPerson = total / totalPeople
  const userAmount = amountPerPerson * payingFor

  const handleConfirm = async () => {
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
              Dividir la cuenta en partes iguales
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Amount Circle */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-full border-4 border-gray-200 flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  ${total.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Cantidad a dividir
                </div>
              </div>
              {/* Visual indicator - partial circle fill */}
              <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent border-r-transparent transform -rotate-45" />
            </div>
          </div>

          {/* Paying For Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-foreground">
                Pagar por
              </span>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setPayingFor(Math.max(1, payingFor - 1))}
                  disabled={payingFor <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">
                  {payingFor}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() =>
                    setPayingFor(Math.min(totalPeople, payingFor + 1))
                  }
                  disabled={payingFor >= totalPeople}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-base text-muted-foreground ml-2">
                  persona{payingFor !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Total People Control */}
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-foreground">De</span>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => {
                    const newTotal = Math.max(1, totalPeople - 1)
                    setTotalPeople(newTotal)
                    if (payingFor > newTotal) {
                      setPayingFor(newTotal)
                    }
                  }}
                  disabled={totalPeople <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">
                  {totalPeople}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setTotalPeople(totalPeople + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-base text-muted-foreground ml-2">
                  en la mesa
                </span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-foreground">
                Estás pagando
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  ${userAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            className="w-full h-12 text-base font-semibold bg-black text-white hover:bg-black/90 rounded-lg"
            onClick={handleConfirm}
            disabled={isProcessing || totalPeople === 0}
          >
            {isProcessing ? "Procesando..." : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

