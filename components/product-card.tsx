"use client"

import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Product } from "@/lib/data"

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => onSelect(product)}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <Button
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
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
