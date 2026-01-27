"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Scan, Pencil, Trash2, Upload, Loader2, Check, QrCode, Eye, Palette } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRestaurant } from "@/lib/restaurant-context"
import { type Product, restaurant } from "@/lib/data"
import { QRGenerator } from "@/components/qr-generator"

type EditMode = "list" | "edit" | "add" | "scan" | "qr"

const THEME_KEY = "smartable-theme"

export default function AdminPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct, setProducts } = useRestaurant()
  const [mode, setMode] = useState<EditMode>("list")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanSuccess, setScanSuccess] = useState(false)
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "")
  const [currentTheme, setCurrentTheme] = useState<string>("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const theme = window.localStorage.getItem(THEME_KEY) || ""
      setCurrentTheme(theme)
      
      // Escuchar cambios en localStorage
      const handleStorageChange = () => {
        const newTheme = window.localStorage.getItem(THEME_KEY) || ""
        setCurrentTheme(newTheme)
      }
      window.addEventListener("storage", handleStorageChange)
      
      // También escuchar cambios en la misma ventana
      const interval = setInterval(() => {
        const newTheme = window.localStorage.getItem(THEME_KEY) || ""
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

  // Determinar el color del texto según el tema
  // - "gold" (Oro & Negro) y "dark" (Noches de Autor): texto blanco
  // - "ocean" (Ocean Green): texto negro
  // - Otros temas: texto normal del tema
  const textColorClass = 
    currentTheme === "gold" || currentTheme === "dark" 
      ? "text-white" 
      : currentTheme === "ocean" 
      ? "text-black" 
      : "text-foreground"

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: categories[0]?.id || "",
    image: "",
  })

  const filteredProducts = products.filter(
    (product) => product.category === activeCategory
  )

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
    })
    setMode("edit")
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      description: "",
      price: "",
      category: activeCategory,
      image: "",
    })
    setMode("add")
  }

  const handleSave = () => {
    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price) || 0,
      category: formData.category,
      image: formData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, productData)
    } else {
      addProduct(productData)
    }
    setMode("list")
  }

  const handleDelete = (id: string) => {
    deleteProduct(id)
    setDeleteConfirm(null)
  }

  const handleScanMenu = async (file: File) => {
    setScanning(true)
    setScanSuccess(false)
    
    // Simulate AI processing of menu image
    await new Promise((resolve) => setTimeout(resolve, 3000))
    
    // Simulated extracted menu items
    const extractedItems: Product[] = [
      {
        id: Date.now().toString() + "1",
        name: "Tacos al Pastor",
        description: "Tacos de cerdo marinado con piña, cilantro y cebolla",
        price: 12.00,
        category: "mains",
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
      },
      {
        id: Date.now().toString() + "2",
        name: "Guacamole Fresco",
        description: "Aguacate fresco con tomate, cebolla, cilantro y limón",
        price: 9.50,
        category: "starters",
        image: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=400&h=300&fit=crop",
      },
      {
        id: Date.now().toString() + "3",
        name: "Enchiladas Verdes",
        description: "Tortillas rellenas de pollo bañadas en salsa verde con crema",
        price: 16.00,
        category: "mains",
        image: "https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=400&h=300&fit=crop",
      },
      {
        id: Date.now().toString() + "4",
        name: "Agua de Horchata",
        description: "Bebida tradicional de arroz con canela y vainilla",
        price: 4.00,
        category: "drinks",
        image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400&h=300&fit=crop",
      },
      {
        id: Date.now().toString() + "5",
        name: "Churros con Chocolate",
        description: "Churros crujientes con salsa de chocolate caliente",
        price: 8.00,
        category: "desserts",
        image: "https://images.unsplash.com/photo-1624371414361-e670edf4892f?w=400&h=300&fit=crop",
      },
    ]

    setProducts([...products, ...extractedItems])
    setScanning(false)
    setScanSuccess(true)
    
    setTimeout(() => {
      setScanSuccess(false)
      setMode("list")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/restaurant/SMARTABLE-REST-001/admin">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold">Panel de Administración</h1>
              <p className="text-xs text-muted-foreground">
                Gestiona el menú y las mesas de tu restaurante
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted">
              <Image
                src={restaurant.logo}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-tight">
                {restaurant.name}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Vista del administrador
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 pb-24">
        {/* Action Buttons */}
        <div className="mb-4">
          <Button
            asChild
            variant="outline"
            className="w-full"
          >
            <Link href="/restaurant/SMARTABLE-REST-001">
              <Eye className={`w-4 h-4 mr-2 ${textColorClass}`} />
              <span className={textColorClass}>Ver como cliente</span>
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Button
            onClick={() => setMode("qr")}
            variant={mode === "qr" ? "default" : "outline"}
            className="h-auto py-4 flex-col gap-2"
          >
            <QrCode className={`w-6 h-6 ${textColorClass}`} />
            <span className={`text-sm ${textColorClass}`}>Códigos QR</span>
          </Button>
          <Button
            onClick={() => setMode("scan")}
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
          >
            <Scan className={`w-6 h-6 ${textColorClass}`} />
            <span className={`text-sm ${textColorClass}`}>Escanear Menú</span>
          </Button>
          <Button
            onClick={handleAdd}
            className="h-auto py-4 flex-col gap-2"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm">Agregar Platillo</span>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
          >
            <Link href="/admin/appearance">
              <Palette className={`w-6 h-6 ${textColorClass}`} />
              <span className={`text-sm ${textColorClass}`}>Mi Restaurante</span>
            </Link>
          </Button>
        </div>

        {/* QR Generator View */}
        {mode === "qr" && (
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Generador de Códigos QR</h2>
              <Button
                variant="outline"
                onClick={() => setMode("list")}
                size="sm"
              >
                Volver a Lista
              </Button>
            </div>
            <QRGenerator />
          </div>
        )}

        {/* Category Tabs - Solo mostrar cuando no está en modo QR */}
        {mode !== "qr" && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
            {categories.map((category) => {
              const isActive = activeCategory === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                    isActive
                      ? "border-primary text-primary bg-transparent"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {category.name}
                </button>
              )
            })}
          </div>
        )}

        {/* Products List */}
        {mode === "list" && (
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-3 bg-primary/5 border border-border/60">
              <div className="flex gap-3">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-sm font-semibold text-primary mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(product)}
                    className="h-8 w-8"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteConfirm(product.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No hay platillos en esta categoría
            </div>
          )}
        </div>
        )}
      </main>

      {/* Edit/Add Dialog */}
      <Dialog open={mode === "edit" || mode === "add"} onOpenChange={() => setMode("list")}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>
              {mode === "edit" ? "Editar Platillo" : "Agregar Platillo"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre del platillo"
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del platillo"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="image">URL de Imagen</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setMode("list")}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={handleSave}
                disabled={!formData.name || !formData.price}
              >
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Scan Dialog */}
      <Dialog open={mode === "scan"} onOpenChange={() => setMode("list")}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Escanear Menú</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {scanning ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-muted-foreground text-center">
                  Analizando tu menú con IA...
                </p>
              </div>
            ) : scanSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <p className="text-foreground font-medium text-center">
                  Menú importado exitosamente
                </p>
                <p className="text-muted-foreground text-sm text-center">
                  Se agregaron 5 platillos a tu menú
                </p>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground text-sm text-center">
                  Sube una foto de tu menú y nuestro sistema de IA extraerá automáticamente todos los platillos con sus descripciones y precios.
                </p>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                  <span className="text-sm font-medium text-foreground">
                    Subir imagen del menú
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    JPG, PNG o PDF
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleScanMenu(file)
                    }}
                  />
                </label>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="max-w-sm mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar platillo</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar este platillo? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
