import { sql } from "./db"
import bcrypt from "bcryptjs"

export interface Restaurant {
  id: string
  name: string
  email: string
  access_id: string
  phone?: string
  address?: string
  logo_url?: string
  tax_rate: number
  created_at: Date
}

export async function registerRestaurant(
  accessId: string,
  name: string,
  email: string,
  password: string,
  phone?: string,
  address?: string
): Promise<{ success: boolean; error?: string; restaurant?: Restaurant }> {
  try {
    // Verificar que el access_id no esté en uso
    const existing = (await sql`
      SELECT id FROM restaurants WHERE access_id = ${accessId}
    `) as any[]
    
    if (existing && existing.length > 0) {
      return { success: false, error: "Este Access ID ya está en uso" }
    }

    // Verificar que el email no esté registrado
    const existingEmail = (await sql`
      SELECT id FROM restaurants WHERE email = ${email}
    `) as any[]
    
    if (existingEmail && existingEmail.length > 0) {
      return { success: false, error: "Este email ya está registrado" }
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10)

    // Crear el restaurante
    const result = (await sql`
      INSERT INTO restaurants (access_id, name, email, password_hash, phone, address)
      VALUES (${accessId}, ${name}, ${email}, ${passwordHash}, ${phone || null}, ${address || null})
      RETURNING id, name, email, access_id, phone, address, logo_url, tax_rate, created_at
    `) as any[]

    if (result.length === 0) {
      return { success: false, error: "Error al crear el restaurante" }
    }

    return { success: true, restaurant: result[0] as Restaurant }
  } catch (error: any) {
    console.error("Error registering restaurant:", error)
    return { success: false, error: error.message || "Error al registrar el restaurante" }
  }
}

export async function loginRestaurant(
  emailOrAccessId: string,
  password: string
): Promise<{ success: boolean; error?: string; restaurant?: Restaurant }> {
  try {
    // Buscar por email o access_id
    const result = (await sql`
      SELECT id, name, email, access_id, phone, address, logo_url, tax_rate, password_hash, created_at
      FROM restaurants
      WHERE email = ${emailOrAccessId} OR access_id = ${emailOrAccessId}
    `) as any[]

    if (!result || result.length === 0) {
      return { success: false, error: "Credenciales incorrectas" }
    }

    const restaurant = result[0] as Restaurant & { password_hash: string }

    // Verificar contraseña
    const isValid = await bcrypt.compare(password, restaurant.password_hash)

    if (!isValid) {
      return { success: false, error: "Credenciales incorrectas" }
    }

    // Remover password_hash del objeto de retorno
    const { password_hash, ...restaurantWithoutPassword } = restaurant

    return { success: true, restaurant: restaurantWithoutPassword as Restaurant }
  } catch (error: any) {
    console.error("Error logging in restaurant:", error)
    return { success: false, error: error.message || "Error al iniciar sesión" }
  }
}

export async function getRestaurantByAccessId(
  accessId: string
): Promise<Restaurant | null> {
  try {
    const result = (await sql`
      SELECT id, name, email, access_id, phone, address, logo_url, tax_rate, created_at
      FROM restaurants
      WHERE access_id = ${accessId}
    `) as any[]

    if (!result || result.length === 0) {
      return null
    }

    return result[0] as Restaurant
  } catch (error) {
    console.error("Error getting restaurant:", error)
    return null
  }
}

