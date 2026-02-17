"use client"

import { useEffect } from "react"
import { MenuPage } from "@/components/menu-page"

const RESTAURANT_ACCESS_ID_KEY = "restaurant-access-id"

interface RestaurantPageProps {
  params: {
    accessId: string
  }
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  // Guardar el accessId en localStorage para usarlo después del pago
  // Nota: En Next.js 15+ params es una promesa, pero aquí seguimos usando la prop directa por compatibilidad o
  // si es < 15. De todas formas, aseguramos que el valor exista.
  useEffect(() => {
    if (typeof window !== "undefined" && params?.accessId) {
      localStorage.setItem(RESTAURANT_ACCESS_ID_KEY, params.accessId)
    }
  }, [params])

  return <MenuPage />
}


