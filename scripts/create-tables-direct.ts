import { neon } from "@neondatabase/serverless"
import { config } from "dotenv"
import { resolve } from "path"

// Cargar variables de entorno
config({ path: resolve(process.cwd(), ".env.local") })

async function createTables() {
  try {
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      console.error("❌ DATABASE_URL is not set")
      process.exit(1)
    }

    console.log("🔌 Connecting to database...")
    const sql = neon(databaseUrl)
    
    console.log("🚀 Creating tables...")
    
    // Crear tablas primero
    await sql`
      CREATE TABLE IF NOT EXISTS restaurants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        access_id VARCHAR(50) UNIQUE NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        logo_url TEXT,
        tax_rate DECIMAL(5, 4) DEFAULT 0.08,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log("✅ Created: restaurants")
    
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(restaurant_id, name)
      )
    `
    console.log("✅ Created: categories")
    
    await sql`
      CREATE TABLE IF NOT EXISTS menu_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
        category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url TEXT,
        is_available BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log("✅ Created: menu_items")
    
    await sql`
      CREATE TABLE IF NOT EXISTS tables (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
        table_number INTEGER NOT NULL,
        qr_code_url TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(restaurant_id, table_number)
      )
    `
    console.log("✅ Created: tables")
    
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
        table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
        table_number INTEGER,
        status VARCHAR(50) DEFAULT 'pending',
        subtotal DECIMAL(10, 2) NOT NULL,
        tax DECIMAL(10, 2) NOT NULL,
        tip DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50),
        payment_status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log("✅ Created: orders")
    
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
        menu_item_name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        subtotal DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log("✅ Created: order_items")
    
    // Crear índices
    console.log("\n📊 Creating indexes...")
    
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_restaurants_access_id ON restaurants(access_id)`
      await sql`CREATE INDEX IF NOT EXISTS idx_restaurants_email ON restaurants(email)`
      await sql`CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id)`
      await sql`CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id)`
      await sql`CREATE INDEX IF NOT EXISTS idx_tables_restaurant ON tables(restaurant_id)`
      await sql`CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id)`
      await sql`CREATE INDEX IF NOT EXISTS idx_orders_table ON orders(table_id)`
      await sql`CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id)`
      console.log("✅ All indexes created")
    } catch (error: any) {
      console.log("ℹ️  Some indexes may already exist")
    }
    
    // Verificar
    console.log("\n🔍 Verifying tables...")
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    ` as any[]
    
    if (tables && tables.length > 0) {
      console.log("\n✅ Database initialized successfully!")
      console.log("📊 Tables in database:")
      tables.forEach((table: any) => {
        console.log(`   ✓ ${table.table_name}`)
      })
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }
}

createTables()

