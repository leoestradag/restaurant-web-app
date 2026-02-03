import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { z } from "zod"

const createOrderSchema = z.object({
  restaurantId: z.string().uuid(),
  tableId: z.string().uuid().optional().nullable(),
  tableNumber: z.number().optional().nullable(),
  subtotal: z.number(),
  tax: z.number(),
  tip: z.number().default(0),
  total: z.number(),
  paymentMethod: z.string().optional().nullable(),
  items: z.array(
    z.object({
      menuItemId: z.string().uuid().optional().nullable(),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
    })
  ),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = createOrderSchema.parse(body)

    // Create the order
    const orderResult = (await sql`
      INSERT INTO orders (
        restaurant_id,
        table_id,
        table_number,
        subtotal,
        tax,
        tip,
        total,
        payment_method,
        payment_status,
        status
      )
      VALUES (
        ${validated.restaurantId},
        ${validated.tableId || null},
        ${validated.tableNumber || null},
        ${validated.subtotal},
        ${validated.tax},
        ${validated.tip},
        ${validated.total},
        ${validated.paymentMethod || null},
        'completed',
        'completed'
      )
      RETURNING id, created_at
    `) as any[]

    if (orderResult.length === 0) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      )
    }

    const orderId = orderResult[0].id

    // Create order items
    for (const item of validated.items) {
      await sql`
        INSERT INTO order_items (
          order_id,
          menu_item_id,
          menu_item_name,
          price,
          quantity,
          subtotal
        )
        VALUES (
          ${orderId},
          ${item.menuItemId || null},
          ${item.name},
          ${item.price},
          ${item.quantity},
          ${item.price * item.quantity}
        )
      `
    }

    return NextResponse.json(
      {
        success: true,
        orderId,
        createdAt: orderResult[0].created_at,
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: error.message || "Error creating order" },
      { status: 500 }
    )
  }
}


