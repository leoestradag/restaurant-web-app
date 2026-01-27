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
      process.exit(1)
    }

    console.log("🔌 Connecting to database...")
    const sql = neon(databaseUrl)
    
    console.log("📖 Reading schema file...")
    const schemaPath = join(process.cwd(), "lib", "schema.sql")
    const schema = readFileSync(schemaPath, "utf-8")
    
    console.log("🚀 Creating tables...")
    
    // Dividir el schema en statements individuales
    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"))
    
    // Ejecutar cada statement usando sql.query con el statement completo
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          // Ejecutar usando sql.query para statements dinámicos
          await sql.query(statement + ";")
          const tableName = statement.match(/CREATE TABLE.*?(\w+)/i)?.[1] || 
                           statement.match(/CREATE INDEX.*?(\w+)/i)?.[1] || 
                           "statement"
          console.log(`✅ ${i + 1}/${statements.length}: ${tableName}`)
        } catch (error: any) {
          // Ignorar errores de "already exists"
          if (
            error.message?.includes("already exists") ||
            error.message?.includes("duplicate") ||
            error.message?.toLowerCase().includes("relation") && error.message?.includes("already")
          ) {
            const tableName = statement.match(/CREATE.*?(\w+)/i)?.[1] || "item"
            console.log(`ℹ️  ${i + 1}/${statements.length}: ${tableName} (ya existe)`)
          } else {
            console.error(`❌ Error en statement ${i + 1}:`, error.message)
            console.error(`Statement: ${statement.substring(0, 100)}...`)
            // Continuar con los siguientes statements
          }
        }
      }
    }
    
    // Verificar que las tablas se crearon
    console.log("\n🔍 Verifying tables...")
    try {
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      ` as any[]
      
      if (tables && tables.length > 0) {
        console.log("\n✅ Database initialized successfully!")
        console.log("📊 Tables found in database:")
        tables.forEach((table: any) => {
          console.log(`   ✓ ${table.table_name}`)
        })
      } else {
        console.log("⚠️  No tables found.")
      }
    } catch (error) {
      console.error("Error verifying tables:", error)
    }
  } catch (error) {
    console.error("❌ Error initializing database:", error)
    process.exit(1)
  }
}

initDatabase()
