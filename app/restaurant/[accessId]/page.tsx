"use client"

import { MenuPage } from "@/components/menu-page"

interface RestaurantPageProps {
  params: {
    accessId: string
  }
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  return <MenuPage />
}


