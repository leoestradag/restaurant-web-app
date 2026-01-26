import { neon } from "@neondatabase/serverless"
import { readFileSync } from "fs"
import { join } from "path"
import { config } from "dotenv"
import { resolve } from "path"

// Cargar variables de entorno desde .env.local
config({ path: resolve(process.cwd(), ".env.local") })

async function initDatabase() {
  try {
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      console.error("❌ DATABASE_URL is not set in environment variables")
      console.log("Please create a .env.local file with:")
      console.log("DATABASE_URL=postgresql://...")
      process.exit(1)
    }

    console.log("🔌 Connecting to database...")
    const sql = neon(databaseUrl)
    
    console.log("📖 Reading schema file...")
    const schemaPath = join(process.cwd(), "lib", "schema.sql")
    const schema = readFileSync(schemaPath, "utf-8")
    
    console.log("🚀 Creating tables...")
    // Ejecutar cada statement por separado
    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"))
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql(statement)
        } catch (error: any) {
          // Ignorar errores de "already exists"
          if (!error.message?.includes("already exists")) {
            console.warn("Warning:", error.message)
          }
        }
      }
    }
    
    console.log("✅ Database initialized successfully!")
    console.log("📊 Tables created:")
    console.log("   - restaurants")
    console.log("   - categories")
    console.log("   - menu_items")
    console.log("   - tables")
    console.log("   - orders")
    console.log("   - order_items")
  } catch (error) {
    console.error("❌ Error initializing database:", error)
    process.exit(1)
  }
}

initDatabase()

