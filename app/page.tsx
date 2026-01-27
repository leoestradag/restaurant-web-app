"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UtensilsCrossed, Sparkles, ArrowRight, LogIn, UserPlus, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Estados para registro
  const [registerData, setRegisterData] = useState({
    accessId: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  })

  // Estados para login
  const [loginData, setLoginData] = useState({
    emailOrAccessId: "",
    password: "",
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessId: registerData.accessId,
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          phone: registerData.phone || undefined,
          address: registerData.address || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al registrar")
        return
      }

      setSuccess("¡Registro exitoso! Redirigiendo...")
      setTimeout(() => {
        router.push(`/restaurant/${data.restaurant.access_id}/admin`)
      }, 1500)
    } catch (error) {
      setError("Error al conectar con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al iniciar sesión")
        return
      }

      setSuccess("¡Inicio de sesión exitoso! Redirigiendo...")
      setTimeout(() => {
        router.push(`/restaurant/${data.restaurant.access_id}/admin`)
      }, 1500)
    } catch (error) {
      setError("Error al conectar con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Smartable</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>Plataforma Inteligente para Restaurantes</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Text */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Transforma tu Restaurante con
              <span className="text-primary"> IA</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sistema de pedidos y pagos inteligente. Tus clientes escanean el QR,
              ordenan y pagan desde su mesa. Simple, rápido y eficiente.
            </p>
          </div>

          {/* Auth Tabs */}
          <Card className="p-6 md:p-8">
            <Tabs defaultValue="register" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="register" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Registrarse
                </TabsTrigger>
                <TabsTrigger value="login" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Iniciar Sesión
                </TabsTrigger>
              </TabsList>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="accessId">Access ID *</Label>
                    <Input
                      id="accessId"
                      value={registerData.accessId}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, accessId: e.target.value })
                      }
                      placeholder="Ingresa el Access ID proporcionado"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      El Access ID te fue proporcionado por el administrador
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="name">Nombre del Restaurante *</Label>
                    <Input
                      id="name"
                      value={registerData.name}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, name: e.target.value })
                      }
                      placeholder="Ej: La Tavola"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, email: e.target.value })
                      }
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password">Contraseña *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, password: e.target.value })
                        }
                        placeholder="Mínimo 6 caracteres"
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, confirmPassword: e.target.value })
                        }
                        placeholder="Repite la contraseña"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono (Opcional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, phone: e.target.value })
                      }
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Dirección (Opcional)</Label>
                    <Input
                      id="address"
                      value={registerData.address}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, address: e.target.value })
                      }
                      placeholder="Calle, Ciudad, Estado"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 rounded-lg bg-green-500/10 text-green-600 text-sm">
                      {success}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Registrando..." : "Crear Cuenta"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="loginId">Email o Access ID *</Label>
                    <Input
                      id="loginId"
                      value={loginData.emailOrAccessId}
                      onChange={(e) =>
                        setLoginData({ ...loginData, emailOrAccessId: e.target.value })
                      }
                      placeholder="Email o Access ID"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="loginPassword">Contraseña *</Label>
                    <Input
                      id="loginPassword"
                      type="password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      placeholder="Tu contraseña"
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 rounded-lg bg-green-500/10 text-green-600 text-sm">
                      {success}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Fácil de Usar</h3>
              <p className="text-sm text-muted-foreground">
                Tus clientes solo escanean el QR y ordenan. Sin complicaciones.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Tecnología IA</h3>
              <p className="text-sm text-muted-foreground">
                Sistema inteligente que optimiza el proceso de pedidos y pagos.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Gestión Completa</h3>
              <p className="text-sm text-muted-foreground">
                Administra tu menú, precios y mesas desde un solo lugar.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
