"use client"

import { useEffect } from "react"
import { MenuPage } from "@/components/menu-page"

const RESTAURANT_ACCESS_ID_KEY = "restaurant-access-id"

interface RestaurantPageProps {
  params: {
    accessId: string
  }
}

import { useParams } from "next/navigation"

export default function RestaurantPage() {
  const params = useParams()

  // Guardar el accessId en localStorage para usarlo después del pago
  useEffect(() => {
    if (typeof window !== "undefined" && params?.accessId) {
      const accessId = Array.isArray(params.accessId) ? params.accessId[0] : params.accessId
      localStorage.setItem(RESTAURANT_ACCESS_ID_KEY, accessId)
    }
  }, [params])

  return <MenuPage />
}


