import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed, Settings, ArrowRight } from "lucide-react"
import Link from "next/link"

interface AdminLandingPageProps {
  params: {
    accessId: string
  }
}

export default function AdminLandingPage({ params }: AdminLandingPageProps) {
  const accessId = params.accessId

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Panel de Administración</p>
              <h1 className="text-lg font-semibold text-foreground">Smartable</h1>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">Access ID: {accessId}</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <Card className="p-6 md:p-8 mb-6">
          <p className="text-sm text-muted-foreground mb-2">Bienvenido</p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Tu restaurante ya está configurado en Smartable
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tu restaurante ya está registrado en Smartable. Desde aquí podrás configurar tu
            menú, mesas y métodos de pago para que tus clientes puedan ordenar y pagar desde
            su mesa.
          </p>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-1 text-foreground">Siguiente paso</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Ve al panel de administración para empezar a configurar tu menú y tus mesas.
              </p>
              <Button asChild className="w-full">
                <Link href="/admin">
                  Ir al panel actual
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-1 text-foreground">Información del restaurante</h3>
              <p className="text-xs text-muted-foreground mb-1">
                Access ID:{" "}
                <span className="font-medium text-foreground break-all">{accessId}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Pronto podrás ver y editar aquí los datos de tu restaurante.
              </p>
            </Card>
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              ¿Listo para configurar tu restaurante?
            </p>
            <p className="text-xs text-muted-foreground">
              En el siguiente paso conectaremos tu menú actual con Smartable.
            </p>
          </div>
          <Button asChild variant="outline" size="icon" className="ml-4">
            <Link href="/admin">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Ir al panel</span>
            </Link>
          </Button>
        </Card>
      </main>
    </div>
  )
}


