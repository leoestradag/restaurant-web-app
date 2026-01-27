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

// Exportar función que se inicializa solo cuando se usa
export const sql = new Proxy({} as ReturnType<typeof neon>, {
  get(_target, prop) {
    const instance = getSql()
    const value = (instance as any)[prop]
    return typeof value === "function" ? value.bind(instance) : value
  },
  apply(_target, _thisArg, argumentsList) {
    const instance = getSql()
    return (instance as any)(...argumentsList)
  },
}) as ReturnType<typeof neon>

