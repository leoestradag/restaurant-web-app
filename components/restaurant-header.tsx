"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { restaurant } from "@/lib/data"

export function RestaurantHeader() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden">
            <Image
              src={restaurant.logo || "/placeholder.svg"}
              alt={restaurant.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">{restaurant.name}</h1>
            <p className="text-xs text-muted-foreground">
              Table {restaurant.tableNumber}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link href="/cart">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {itemCount}
              </Badge>
            )}
            <span className="sr-only">View cart</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
