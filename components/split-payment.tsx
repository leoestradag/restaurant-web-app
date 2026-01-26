"use client"

import { useState } from "react"
import { Plus, X, User, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CartItem } from "@/lib/data"

interface SplitPerson {
  id: string
  name: string
  items: { itemId: string; quantity: number }[]
}

interface SplitPaymentProps {
  items: CartItem[]
  subtotal: number
  tax: number
  onSplitChange: (split: SplitPerson[]) => void
}

export function SplitPayment({ items, subtotal, tax, onSplitChange }: SplitPaymentProps) {
  const [people, setPeople] = useState<SplitPerson[]>([
    { id: "1", name: "Persona 1", items: [] },
  ])
  const [selectedPerson, setSelectedPerson] = useState<string>("1")
  const [itemAssignments, setItemAssignments] = useState<Record<string, string>>({})

  const addPerson = () => {
    const newId = (people.length + 1).toString()
    setPeople([...people, { id: newId, name: `Persona ${people.length + 1}`, items: [] }])
    setSelectedPerson(newId)
  }

  const removePerson = (id: string) => {
    if (people.length === 1) return // No permitir eliminar la última persona
    const updated = people.filter((p) => p.id !== id)
    setPeople(updated)
    if (selectedPerson === id) {
      setSelectedPerson(updated[0].id)
    }
    // Limpiar asignaciones de items de la persona eliminada
    const newAssignments = { ...itemAssignments }
    Object.keys(newAssignments).forEach((itemId) => {
      if (newAssignments[itemId] === id) {
        delete newAssignments[itemId]
      }
    })
    setItemAssignments(newAssignments)
    updateSplit(updated, newAssignments)
  }

  const updatePersonName = (id: string, name: string) => {
    const updated = people.map((p) => (p.id === id ? { ...p, name } : p))
    setPeople(updated)
    updateSplit(updated, itemAssignments)
  }

  const assignItem = (itemId: string, personId: string) => {
    const newAssignments = { ...itemAssignments, [itemId]: personId }
    setItemAssignments(newAssignments)
    updateSplit(people, newAssignments)
  }

  const updateSplit = (updatedPeople: SplitPerson[], assignments: Record<string, string>) => {
    // Agrupar items por persona
    const split: SplitPerson[] = updatedPeople.map((person) => ({
      ...person,
      items: [],
    }))

    items.forEach((item) => {
      const personId = assignments[item.id]
      if (personId) {
        const person = split.find((p) => p.id === personId)
        if (person) {
          person.items.push({ itemId: item.id, quantity: item.quantity })
        }
      }
    })

    setPeople(split)
    onSplitChange(split)
  }

  const calculatePersonTotal = (person: SplitPerson): number => {
    const personItems = items.filter((item) =>
      person.items.some((pi) => pi.itemId === item.id)
    )
    const personSubtotal = personItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const personTax = personSubtotal * (tax / subtotal) || 0
    return personSubtotal + personTax
  }

  const totalAssigned = people.reduce((sum, person) => sum + calculatePersonTotal(person), 0)
  const remaining = subtotal + tax - totalAssigned

  return (
    <div className="space-y-4">
      {/* Agregar personas */}
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Dividir entre:</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPerson}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Persona
        </Button>
      </div>

      {/* Lista de personas */}
      <div className="space-y-2">
        {people.map((person) => (
          <Card
            key={person.id}
            className={cn(
              "p-3 transition-colors",
              selectedPerson === person.id && "border-primary bg-primary/5"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Input
                value={person.name}
                onChange={(e) => updatePersonName(person.id, e.target.value)}
                className="flex-1 h-8"
                placeholder="Nombre de la persona"
              />
              {people.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removePerson(person.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold">
                ${calculatePersonTotal(person).toFixed(2)}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Asignar items */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Asignar items a cada persona:</Label>
        <div className="space-y-2">
          {items.map((item) => {
            const assignedTo = itemAssignments[item.id]
            return (
              <Card key={item.id} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ${item.price.toFixed(2)} × {item.quantity} = $
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {people.map((person) => (
                    <Button
                      key={person.id}
                      type="button"
                      variant={assignedTo === person.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => assignItem(item.id, person.id)}
                      className="text-xs"
                    >
                      {assignedTo === person.id && (
                        <Check className="h-3 w-3 mr-1" />
                      )}
                      {person.name}
                    </Button>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Resumen */}
      <Card className="p-4 bg-muted/50">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total asignado:</span>
            <span className="font-medium">${totalAssigned.toFixed(2)}</span>
          </div>
          {remaining > 0.01 && (
            <div className="flex justify-between text-sm text-amber-600">
              <span>Pendiente de asignar:</span>
              <span className="font-medium">${remaining.toFixed(2)}</span>
            </div>
          )}
          {remaining < -0.01 && (
            <div className="flex justify-between text-sm text-red-600">
              <span>Asignado de más:</span>
              <span className="font-medium">${Math.abs(remaining).toFixed(2)}</span>
            </div>
          )}
          {Math.abs(remaining) <= 0.01 && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              <span>Todos los items están asignados</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

