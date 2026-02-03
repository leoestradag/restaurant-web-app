"use client"

import { useState } from "react"
import { CreditCard, Trash2, Star, StarOff, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { usePaymentMethods, type SavedPaymentMethod } from "@/lib/payment-methods-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SavedPaymentMethods() {
  const { savedMethods, addMethod, removeMethod, setDefaultMethod } = usePaymentMethods()
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "card" as "card" | "apple" | "google",
    last4: "",
    brand: "Visa",
    isDefault: false,
  })

  const handleAdd = () => {
    if (formData.name) {
      addMethod({
        name: formData.name,
        type: formData.type,
        last4: formData.last4 || undefined,
        brand: formData.brand || undefined,
        isDefault: formData.isDefault || savedMethods.length === 0,
      })
      setFormData({
        name: "",
        type: "card",
        last4: "",
        brand: "Visa",
        isDefault: false,
      })
      setIsAdding(false)
    }
  }

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-5 w-5" />
      case "apple":
        return <span className="text-lg">🍎</span>
      case "google":
        return <span className="text-lg">G</span>
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const getMethodDisplay = (method: SavedPaymentMethod) => {
    if (method.type === "card" && method.last4) {
      return `${method.brand || "Card"} •••• ${method.last4}`
    }
    return method.name
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">Métodos de Pago Guardados</h3>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Método de Pago</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="method-name">Nombre descriptivo</Label>
                <Input
                  id="method-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Mi Tarjeta Principal"
                />
              </div>
              <div>
                <Label htmlFor="method-type">Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "card" | "apple" | "google") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="apple">Apple Pay</SelectItem>
                    <SelectItem value="google">Google Pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.type === "card" && (
                <>
                  <div>
                    <Label htmlFor="method-last4">Últimos 4 dígitos</Label>
                    <Input
                      id="method-last4"
                      value={formData.last4}
                      onChange={(e) =>
                        setFormData({ ...formData, last4: e.target.value.slice(0, 4) })
                      }
                      placeholder="1234"
                      maxLength={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="method-brand">Marca</Label>
                    <Select
                      value={formData.brand}
                      onValueChange={(value) => setFormData({ ...formData, brand: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Visa">Visa</SelectItem>
                        <SelectItem value="Mastercard">Mastercard</SelectItem>
                        <SelectItem value="American Express">American Express</SelectItem>
                        <SelectItem value="Discover">Discover</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-default"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="is-default" className="cursor-pointer">
                  Usar como método predeterminado
                </Label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleAdd} disabled={!formData.name}>
                  Guardar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {savedMethods.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No tienes métodos de pago guardados. Agrega uno para pagos rápidos.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {savedMethods.map((method) => (
            <Card
              key={method.id}
              className={cn(
                "p-3 flex items-center justify-between",
                method.isDefault && "border-primary bg-primary/5"
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {getMethodIcon(method.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{getMethodDisplay(method)}</p>
                    {method.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Predeterminado
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{method.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDefaultMethod(method.id)}
                    title="Marcar como predeterminado"
                  >
                    <StarOff className="h-4 w-4" />
                  </Button>
                )}
                {method.isDefault && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Método predeterminado"
                    disabled
                  >
                    <Star className="h-4 w-4 text-primary fill-primary" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removeMethod(method.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


