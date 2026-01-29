"use client"

import { useState, useEffect } from "react"
import { RestaurantHeader } from "./restaurant-header"
import { CategoryTabs } from "./category-tabs"
import { ProductCard } from "./product-card"
import { ProductDetailModal } from "./product-detail-modal"
import { CustomerAuthModal } from "./customer-auth-modal"
import { type Product } from "@/lib/data"
import { useRestaurant } from "@/lib/restaurant-context"
import { OwnerBanner } from "./owner-banner"

const AUTH_MODAL_KEY = "customer-auth-seen"

export function MenuPage() {
  const { products, categories } = useRestaurant()
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    // Mostrar el modal solo si no se ha visto antes en esta sesión
    if (typeof window !== "undefined") {
      const hasSeenModal = sessionStorage.getItem(AUTH_MODAL_KEY)
      if (!hasSeenModal) {
        setShowAuthModal(true)
      }
    }
  }, [])

  const handleCloseModal = () => {
    setShowAuthModal(false)
    if (typeof window !== "undefined") {
      sessionStorage.setItem(AUTH_MODAL_KEY, "true")
    }
  }

  const handleGuestContinue = () => {
    handleCloseModal()
  }

  const filteredProducts = products.filter(
    (product) => product.category === activeCategory
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/70">
      <RestaurantHeader />
      <main className="px-4 py-4 pb-32 max-w-5xl mx-auto">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>
      </main>
      <ProductDetailModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <CustomerAuthModal
        open={showAuthModal}
        onClose={handleCloseModal}
        onGuestContinue={handleGuestContinue}
      />
      <OwnerBanner />
    </div>
  )
}
