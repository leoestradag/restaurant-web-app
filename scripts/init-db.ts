import { sql } from "../lib/db"
import { readFileSync } from "fs"
import { join } from "path"

async function initDatabase() {
  try {
    console.log("Initializing database...")
    
    // Leer el archivo SQL
    const schemaPath = join(process.cwd(), "lib", "schema.sql")
    const schema = readFileSync(schemaPath, "utf-8")
    
    // Ejecutar el schema
    await sql(schema)
    
    console.log("✅ Database initialized successfully!")
  } catch (error) {
    console.error("❌ Error initializing database:", error)
    process.exit(1)
  }
}

initDatabase()


