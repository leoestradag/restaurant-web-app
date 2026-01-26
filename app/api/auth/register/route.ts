import { NextRequest, NextResponse } from "next/server"
import { registerRestaurant } from "@/lib/auth"
import { z } from "zod"

const registerSchema = z.object({
  accessId: z.string().min(3, "Access ID debe tener al menos 3 caracteres"),
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos
    const validated = registerSchema.parse(body)
    
    // Registrar restaurante
    const result = await registerRestaurant(
      validated.accessId,
      validated.name,
      validated.email,
      validated.password,
      validated.phone,
      validated.address
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: true, restaurant: result.restaurant },
      { status: 201 }
    )
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Error in register route:", error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}

