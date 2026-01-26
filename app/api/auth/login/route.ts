import { NextRequest, NextResponse } from "next/server"
import { loginRestaurant } from "@/lib/auth"
import { z } from "zod"
import { cookies } from "next/headers"

const loginSchema = z.object({
  emailOrAccessId: z.string().min(1, "Email o Access ID requerido"),
  password: z.string().min(1, "Contraseña requerida"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos
    const validated = loginSchema.parse(body)
    
    // Iniciar sesión
    const result = await loginRestaurant(
      validated.emailOrAccessId,
      validated.password
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    // Crear cookie de sesión
    const cookieStore = await cookies()
    cookieStore.set("restaurant_session", JSON.stringify({
      id: result.restaurant!.id,
      access_id: result.restaurant!.access_id,
      name: result.restaurant!.name,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    })

    return NextResponse.json(
      { success: true, restaurant: result.restaurant },
      { status: 200 }
    )
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Error in login route:", error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}

