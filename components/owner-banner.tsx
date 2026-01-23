"use client"

import Link from "next/link"
import { Store } from "lucide-react"

export function OwnerBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 shadow-lg">
      <Link
        href="/admin"
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Store className="w-4 h-4" />
        <span>
          <span className="font-medium">Dueño de un restaurante?</span>{" "}
          Da click aquí
        </span>
      </Link>
    </div>
  )
}
