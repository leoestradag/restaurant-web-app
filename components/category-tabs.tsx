"use client"

import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
}

interface CategoryTabsProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
            activeCategory === category.id
              ? "border-primary text-primary bg-transparent"
              : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
