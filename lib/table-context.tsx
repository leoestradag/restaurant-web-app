"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface TableContextType {
  tableNumber: number | null
  setTableNumber: (table: number | null) => void
  getTableUrl: (table: number) => string
}

const TableContext = createContext<TableContextType | undefined>(undefined)

export function TableProvider({ children }: { children: ReactNode }) {
  const [tableNumber, setTableNumber] = useState<number | null>(null)

  // Obtener el número de mesa desde la URL al cargar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const tableParam = params.get("table")
      
      if (tableParam) {
        const tableNum = Number.parseInt(tableParam, 10)
        if (!Number.isNaN(tableNum) && tableNum > 0) {
          setTableNumber(tableNum)
        }
      }
    }
  }, [])

  const getTableUrl = (table: number): string => {
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin
      return `${baseUrl}/?table=${table}`
    }
    return `/?table=${table}`
  }

  return (
    <TableContext.Provider
      value={{
        tableNumber,
        setTableNumber,
        getTableUrl,
      }}
    >
      {children}
    </TableContext.Provider>
  )
}

export function useTable() {
  const context = useContext(TableContext)
  if (!context) {
    throw new Error("useTable must be used within a TableProvider")
  }
  return context
}


