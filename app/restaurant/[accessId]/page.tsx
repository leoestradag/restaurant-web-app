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
  useEffect(() => {
    if (typeof window !== "undefined" && params.accessId) {
      localStorage.setItem(RESTAURANT_ACCESS_ID_KEY, params.accessId)
    }
  }, [params.accessId])

  return <MenuPage />
}


