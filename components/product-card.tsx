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
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 bg-card/95 border-border/70"
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
            <h3 className="font-semibold text-sm text-foreground line-clamp-2">
              {product.name}
            </h3>
          </div>
          <span className="text-sm font-semibold text-primary whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-muted-foreground line-clamp-2">
            {product.description}
          </p>
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
