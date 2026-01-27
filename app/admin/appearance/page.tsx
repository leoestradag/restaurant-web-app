"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Palette } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type ThemeId = "warm" | "fresh" | "dark"
type FontId = "rounded" | "serif" | "clean"

const THEME_KEY = "smartable-theme"
const FONT_KEY = "smartable-font"

const themes: Record<
  ThemeId,
  {
    name: string
    description: string
    previewClass: string
  }
> = {
  warm: {
    name: "Cálido Gourmet",
    description: "Naranjas y rojos elegantes, ideal para restaurantes acogedores.",
    previewClass: "bg-gradient-to-br from-orange-500 to-rose-500",
  },
  fresh: {
    name: "Fresh & Green",
    description: "Verdes y tonos claros, perfecto para cocina saludable.",
    previewClass: "bg-gradient-to-br from-emerald-500 to-lime-500",
  },
  dark: {
    name: "Noches de Autor",
    description: "Fondo oscuro con acentos brillantes, estilo fine dining.",
    previewClass: "bg-gradient-to-br from-slate-900 to-indigo-700",
  },
}

const fonts: Record<
  FontId,
  {
    name: string
    description: string
    className: string
  }
> = {
  rounded: {
    name: "Redondeada Moderna",
    description: "Tipografía amigable y actual.",
    className: "font-sans",
  },
  serif: {
    name: "Clásica Serif",
    description: "Ideal para restaurantes elegantes.",
    className: "font-serif",
  },
  clean: {
    name: "Minimal Clean",
    description: "Líneas rectas y limpias.",
    className: "font-sans tracking-wide",
  },
}

export default function AppearancePage() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>("warm")
  const [selectedFont, setSelectedFont] = useState<FontId>("rounded")

  useEffect(() => {
    if (typeof window === "undefined") return

    const storedTheme = window.localStorage.getItem(THEME_KEY) as ThemeId | null
    const storedFont = window.localStorage.getItem(FONT_KEY) as FontId | null

    if (storedTheme && themes[storedTheme]) {
      setSelectedTheme(storedTheme)
    }
    if (storedFont && fonts[storedFont]) {
      setSelectedFont(storedFont)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    window.localStorage.setItem(THEME_KEY, selectedTheme)
    window.localStorage.setItem(FONT_KEY, selectedFont)
  }, [selectedTheme, selectedFont])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Mi Restaurante
            </h1>
            <p className="text-xs text-muted-foreground">
              Personaliza el estilo visual de tu menú para este restaurante.
            </p>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 pb-24 max-w-4xl mx-auto space-y-6">
        {/* Preview simple */}
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Vista previa</p>
            <h2
              className={`text-xl font-semibold ${fonts[selectedFont].className}`}
            >
              La Tavola
            </h2>
            <p className="text-xs text-muted-foreground">
              Así se verá el encabezado de tu restaurante.
            </p>
          </div>
          <div
            className={`h-16 w-32 rounded-xl ${themes[selectedTheme].previewClass}`}
          />
        </Card>

        {/* Themes */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Paleta de colores</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {Object.entries(themes).map(([id, theme]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedTheme(id as ThemeId)}
                className={`text-left rounded-xl border p-3 space-y-2 transition-all ${
                  selectedTheme === id
                    ? "border-primary ring-1 ring-primary/50 bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div
                  className={`h-16 w-full rounded-lg mb-2 ${theme.previewClass}`}
                />
                <p className="text-sm font-medium">{theme.name}</p>
                <p className="text-xs text-muted-foreground">
                  {theme.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Fonts */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Tipografía del menú</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {Object.entries(fonts).map(([id, font]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedFont(id as FontId)}
                className={`text-left rounded-xl border p-3 space-y-1 transition-all ${
                  selectedFont === id
                    ? "border-primary ring-1 ring-primary/50 bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <p className={`text-sm font-medium ${font.className}`}>
                  {font.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {font.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        <p className="text-[11px] text-muted-foreground">
          Nota: por ahora estos cambios son solo visuales de referencia. En el
          siguiente paso conectaremos estos estilos para que se apliquen a la
          vista del cliente de este restaurante.
        </p>
      </main>
    </div>
  )
}


