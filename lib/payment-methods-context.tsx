"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface SavedPaymentMethod {
  id: string
  type: "card" | "apple" | "google"
  last4?: string // Para tarjetas: últimos 4 dígitos
  brand?: string // Para tarjetas: Visa, Mastercard, etc.
  name: string // Nombre descriptivo
  isDefault?: boolean
}

interface PaymentMethodsContextType {
  savedMethods: SavedPaymentMethod[]
  addMethod: (method: Omit<SavedPaymentMethod, "id">) => void
  removeMethod: (id: string) => void
  setDefaultMethod: (id: string) => void
  getDefaultMethod: () => SavedPaymentMethod | null
}

const PaymentMethodsContext = createContext<PaymentMethodsContextType | undefined>(undefined)

const STORAGE_KEY = "saved_payment_methods"

export function PaymentMethodsProvider({ children }: { children: ReactNode }) {
  const [savedMethods, setSavedMethods] = useState<SavedPaymentMethod[]>([])

  // Cargar métodos guardados del localStorage al iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as SavedPaymentMethod[]
          setSavedMethods(parsed)
        }
      } catch (error) {
        console.error("Error loading saved payment methods:", error)
      }
    }
  }, [])

  // Guardar métodos en localStorage cuando cambien
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMethods))
      } catch (error) {
        console.error("Error saving payment methods:", error)
      }
    }
  }, [savedMethods])

  const addMethod = (method: Omit<SavedPaymentMethod, "id">) => {
    const newMethod: SavedPaymentMethod = {
      ...method,
      id: Date.now().toString(),
      isDefault: savedMethods.length === 0 ? true : method.isDefault || false,
    }

    // Si se marca como default, quitar default de los demás
    if (newMethod.isDefault) {
      setSavedMethods((prev) =>
        prev.map((m) => ({ ...m, isDefault: false })).concat(newMethod)
      )
    } else {
      setSavedMethods((prev) => [...prev, newMethod])
    }
  }

  const removeMethod = (id: string) => {
    setSavedMethods((prev) => {
      const filtered = prev.filter((m) => m.id !== id)
      // Si se eliminó el método default y hay otros, hacer default el primero
      if (filtered.length > 0 && !filtered.some((m) => m.isDefault)) {
        filtered[0].isDefault = true
      }
      return filtered
    })
  }

  const setDefaultMethod = (id: string) => {
    setSavedMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    )
  }

  const getDefaultMethod = (): SavedPaymentMethod | null => {
    return savedMethods.find((m) => m.isDefault) || savedMethods[0] || null
  }

  return (
    <PaymentMethodsContext.Provider
      value={{
        savedMethods,
        addMethod,
        removeMethod,
        setDefaultMethod,
        getDefaultMethod,
      }}
    >
      {children}
    </PaymentMethodsContext.Provider>
  )
}

export function usePaymentMethods() {
  const context = useContext(PaymentMethodsContext)
  if (!context) {
    throw new Error("usePaymentMethods must be used within a PaymentMethodsProvider")
  }
  return context
}


