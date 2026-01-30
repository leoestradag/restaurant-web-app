"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/data"

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
}

const THEME_KEY = "smartable-theme"

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const [currentTheme, setCurrentTheme] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = window.localStorage.getItem(THEME_KEY)
      setCurrentTheme(storedTheme)

      const handleStorageChange = () => {
        setCurrentTheme(window.localStorage.getItem(THEME_KEY))
      }

      window.addEventListener("storage", handleStorageChange)
      
      // También escuchar cambios en la misma ventana
      const interval = setInterval(() => {
        const newTheme = window.localStorage.getItem(THEME_KEY)
        if (newTheme !== currentTheme) {
          setCurrentTheme(newTheme)
        }
      }, 500)

      return () => {
        window.removeEventListener("storage", handleStorageChange)
        clearInterval(interval)
      }
    }
  }, [currentTheme])

  const isGoldTheme = currentTheme === "gold"

  return (
    <Card
      className={cn(
        "overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5",
        isGoldTheme
          ? "bg-black border-amber-500/30"
          : "bg-card/95 border-border/70"
      )}
      onClick={() => onSelect(product)}
    >
      <div className="relative aspect-[3/2]">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 45vw, 280px"
        />
      </div>
      <div className="p-3 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-semibold text-sm line-clamp-2",
                isGoldTheme ? "text-amber-400" : "text-foreground"
              )}
            >
              {product.name}
            </h3>
          </div>
          <span
            className={cn(
              "text-sm font-semibold whitespace-nowrap",
              isGoldTheme ? "text-amber-400" : "text-primary"
            )}
          >
            ${product.price.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <p
            className={cn(
              "text-[11px] line-clamp-2",
              isGoldTheme ? "text-amber-300/80" : "text-muted-foreground"
            )}
          >
            {product.description}
          </p>
          <Button
            size="icon"
            className={cn(
              "h-8 w-8 shrink-0 rounded-full",
              isGoldTheme
                ? "bg-amber-500 hover:bg-amber-600 text-black"
                : ""
            )}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(product)
            }}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add {product.name}</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
