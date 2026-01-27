import { neon } from "@neondatabase/serverless"

// Lazy initialization - solo se crea cuando se usa
let sqlInstance: ReturnType<typeof neon> | null = null

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in environment variables")
  }
  
  if (!sqlInstance) {
    sqlInstance = neon(process.env.DATABASE_URL)
  }
  
  return sqlInstance
}

// Crear sql como función tagged template que se inicializa solo cuando se llama
// Esto evita que falle durante el build de Next.js
const sqlFunction = (strings: TemplateStringsArray, ...values: any[]) => {
  return getSql()(strings, ...values)
}

// Hacer que sql sea compatible con tagged templates y también como objeto
export const sql = Object.assign(sqlFunction, {
  query: (...args: any[]) => getSql().query(...args),
}) as ReturnType<typeof neon>
