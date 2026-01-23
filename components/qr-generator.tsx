"use client"

import { QRCodeSVG } from "react-qr-code"
import { Download, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useTable } from "@/lib/table-context"

export function QRGenerator() {
  const { getTableUrl } = useTable()
  const [tableNumber, setTableNumber] = useState<number>(1)
  const [copied, setCopied] = useState(false)

  const tableUrl = getTableUrl(tableNumber)

  const handleDownload = () => {
    const svg = document.getElementById(`qr-code-${tableNumber}`)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = `mesa-${tableNumber}-qr.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tableUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="table-number">Número de Mesa</Label>
        <Input
          id="table-number"
          type="number"
          min="1"
          value={tableNumber}
          onChange={(e) => setTableNumber(Number.parseInt(e.target.value) || 1)}
          className="h-12"
        />
      </div>

      <Card className="p-6 flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG
            id={`qr-code-${tableNumber}`}
            value={tableUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        
        <div className="text-center space-y-2 w-full">
          <p className="text-sm font-medium text-foreground">Mesa {tableNumber}</p>
          <p className="text-xs text-muted-foreground break-all">{tableUrl}</p>
        </div>

        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar URL
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar QR
          </Button>
        </div>
      </Card>

      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
        <p className="text-sm font-medium text-foreground">Instrucciones:</p>
        <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Ingresa el número de mesa que deseas generar</li>
          <li>Descarga el código QR o copia la URL</li>
          <li>Imprime el QR y colócalo en la mesa correspondiente</li>
          <li>Los clientes escanearán el código para acceder al menú de esa mesa</li>
        </ol>
      </div>
    </div>
  )
}

