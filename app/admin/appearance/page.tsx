"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Palette } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type ThemeId = "warm" | "fresh" | "dark" | "gold" | "ocean"
type FontId = "rounded" | "serif" | "clean" | "playful" | "compact"

const THEME_KEY = "smartable-theme"
const FONT_KEY = "smartable-font"

type ThemeConfig = {
  name: string
  description: string
  previewClass: string
  vars: {
    primary: string
    accent: string
    background: string
  }
}

const themes: Record<ThemeId, ThemeConfig> = {
  warm: {
    name: "Cálido Gourmet",
    description: "Naranjas y rojos elegantes, ideal para restaurantes acogedores.",
    previewClass: "bg-gradient-to-br from-orange-500 to-rose-500",
    vars: {
      primary: "oklch(0.65 0.22 45)",
      accent: "oklch(0.6 0.18 280)",
      background: "oklch(0.99 0.005 85)",
    },
  },
  fresh: {
    name: "Fresh & Green",
    description: "Verdes y tonos claros, perfecto para cocina saludable.",
    previewClass: "bg-gradient-to-br from-emerald-500 to-lime-500",
    vars: {
      primary: "oklch(0.78 0.18 140)",
      accent: "oklch(0.72 0.16 180)",
      background: "oklch(0.985 0.01 145)",
    },
  },
  dark: {
    name: "Noches de Autor",
    description: "Fondo oscuro con acentos brillantes, estilo fine dining.",
    previewClass: "bg-gradient-to-br from-slate-900 to-indigo-700",
    vars: {
      primary: "oklch(0.72 0.18 280)",
      accent: "oklch(0.78 0.19 330)",
      background: "oklch(0.18 0.02 260)",
    },
  },
  gold: {
    name: "Oro & Negro",
    description: "Letras doradas sobre fondo negro, estilo lujo.",
    previewClass: "bg-gradient-to-br from-yellow-400 to-amber-600",
    vars: {
      primary: "oklch(0.82 0.17 90)",
      accent: "oklch(0.88 0.12 80)",
      background: "oklch(0.16 0.02 260)",
    },
  },
  ocean: {
    name: "Ocean Green",
    description: "Azules y verdes profundos, ideal para mariscos.",
    previewClass: "bg-gradient-to-br from-teal-500 to-sky-500",
    vars: {
      primary: "oklch(0.72 0.15 210)",
      accent: "oklch(0.76 0.14 190)",
      background: "oklch(0.97 0.02 200)",
    },
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
  playful: {
    name: "Playful",
    description: "Títulos más grandes y expresivos.",
    className: "font-sans tracking-wide uppercase",
  },
  compact: {
    name: "Compacta",
    description: "Texto más compacto para menús con muchos platos.",
    className: "font-sans text-sm",
  },
}

function applyThemeToDocument(themeId: ThemeId, fontId: FontId) {
  if (typeof document === "undefined") return
  const theme = themes[themeId]

  const root = document.documentElement
  root.style.setProperty("--primary", theme.vars.primary)
  root.style.setProperty("--accent", theme.vars.accent)
  root.style.setProperty("--background", theme.vars.background)

  // Reset font classes on root
  root.classList.remove("font-sans", "font-serif")
  if (fontId === "serif") {
    root.classList.add("font-serif")
  } else {
    root.classList.add("font-sans")
  }
}

export default function AppearancePage() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>("warm")
  const [selectedFont, setSelectedFont] = useState<FontId>("rounded")
  const [initialTheme, setInitialTheme] = useState<ThemeId | null>(null)
  const [initialFont, setInitialFont] = useState<FontId | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const storedTheme = window.localStorage.getItem(THEME_KEY) as ThemeId | null
    const storedFont = window.localStorage.getItem(FONT_KEY) as FontId | null

    if (storedTheme && themes[storedTheme]) {
      setSelectedTheme(storedTheme)
      setInitialTheme(storedTheme)
    }
    if (storedFont && fonts[storedFont]) {
      setSelectedFont(storedFont)
      setInitialFont(storedFont)
    }
  }, [])

  const hasChanges =
    initialTheme !== null &&
    initialFont !== null &&
    (selectedTheme !== initialTheme || selectedFont !== initialFont)

  const handleSave = () => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(THEME_KEY, selectedTheme)
    window.localStorage.setItem(FONT_KEY, selectedFont)
    applyThemeToDocument(selectedTheme, selectedFont)
    setInitialTheme(selectedTheme)
    setInitialFont(selectedFont)
  }

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
        <Card 
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: themes[selectedTheme].vars.background }}
        >
          <div>
            <p className="text-xs text-muted-foreground mb-1">Vista previa</p>
            <h2
              className={`text-xl font-semibold ${fonts[selectedFont].className}`}
              style={{ color: themes[selectedTheme].vars.primary }}
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

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={!hasChanges}>
            Guardar cambios
          </Button>
        </div>

        {/* Themes */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Paleta de colores</h3>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
            {Object.entries(themes).map(([id, theme]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedTheme(id as ThemeId)}
                className={`text-left rounded-xl border-2 p-3 space-y-2 transition-all shadow-md hover:shadow-lg ${
                  selectedTheme === id
                    ? "border-primary ring-2 ring-primary/50 bg-primary/5 shadow-lg scale-105"
                    : "border-border hover:border-primary/40 hover:shadow-lg"
                }`}
              >
                <div
                  className={`h-16 w-full rounded-lg mb-2 ${theme.previewClass}`}
                />
                <p className="text-sm font-medium text-red-600">{theme.name}</p>
                <p className="text-xs text-red-500">
                  {theme.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Fonts */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Tipografía del menú</h3>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
            {Object.entries(fonts).map(([id, font]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedFont(id as FontId)}
                className={`text-left rounded-xl border-2 p-3 space-y-1 transition-all shadow-md hover:shadow-lg ${
                  selectedFont === id
                    ? "border-primary ring-2 ring-primary/50 bg-primary/5 shadow-lg scale-105"
                    : "border-border hover:border-primary/40 hover:shadow-lg"
                }`}
              >
                <p className={`text-sm font-medium text-red-600 ${font.className}`}>
                  {font.name}
                </p>
                <p className="text-xs text-red-500">
                  {font.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        <p className="text-[11px] text-muted-foreground">
          Los cambios se aplican a la vista del cliente en este navegador una
          vez que presiones <span className="font-medium">Guardar cambios</span>.
        </p>
      </main>
    </div>
  )
}


