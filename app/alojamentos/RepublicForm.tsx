"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { MapPin, Users, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const formSchema = z.object({
    street: z.string().min(3, { message: "Rua deve ter pelo menos 3 caracteres" }),
    number: z.string().min(1, { message: "Número é obrigatório" }),
    neighborhood: z.string().min(2, { message: "Bairro deve ter pelo menos 2 caracteres" }),
    city: z.string().min(2, { message: "Cidade deve ter pelo menos 2 caracteres" }),
    postalCode: z.string().regex(/^\d{5}-?\d{3}$/, { message: "CEP deve estar no formato 00000-000" }),
    residents: z.string().min(1, { message: "Selecione a quantidade de moradores" }),
})

type FormValues = z.infer<typeof formSchema>

const residentsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => ({
    value: num.toString(),
    label: `${num} ${num === 1 ? "morador" : "moradores"}`,
}))

export default function RepublicForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            street: "",
            number: "",
            neighborhood: "",
            city: "",
            postalCode: "",
            residents: "",
        },
        mode: "onChange",
    })

    const formatCEP = (value: string) => {
        const cleaned = value.replace(/\D/g, "")
        if (cleaned.length <= 5) {
            return cleaned
        }
        return cleaned.slice(0, 5) + "-" + cleaned.slice(5, 8)
    }

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true)

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300"

            const response = await fetch(`${apiUrl}/alojamento`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `Erro HTTP: ${response.status}`)
            }

            toast.success(
                `Alojamento cadastrado com sucesso! Endereço: ${data.street}, ${data.number} - ${data.neighborhood}, ${data.city}`,
                { duration: 5000 },
            )

            alert("✅ Alojamento cadastrado com sucesso!")

         form.reset({
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        postalCode: "",
        residents: "",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      toast.error(`Erro ao cadastrar alojamento: ${errorMessage}`)
      console.error("Erro no cadastro:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

    return (
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm max-w-4xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="p-8 space-y-8">
                        {/* Address Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Endereço do Alojamento</h2>
                            </div>

                            <FormField
                                control={form.control}
                                name="postalCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">CEP</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="00000-000"
                                                {...field}
                                                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                                onChange={(e) => {
                                                    const formatted = formatCEP(e.target.value)
                                                    field.onChange(formatted)
                                                }}
                                                maxLength={9}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="street"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">Rua/Avenida</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Digite o nome da rua ou avenida"
                                                        {...field}
                                                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Número</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="123"
                                                    {...field}
                                                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="neighborhood"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Bairro</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Digite o nome do bairro"
                                                    {...field}
                                                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Cidade</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Digite o nome da cidade"
                                                    {...field}
                                                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Residents Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-4 h-4 text-green-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Capacidade</h2>
                            </div>

                            <FormField
                                control={form.control}
                                name="residents"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Quantidade de Moradores</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 text-gray-900">
                                                    <SelectValue placeholder="Selecione a quantidade de moradores" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white max-h-60">
                                                {residentsOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value} className="text-gray-700">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-4 h-4 text-green-600" />
                                                            {option.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            Capacidade máxima de pessoas que podem residir no alojamento
                                        </p>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between px-8 py-6 bg-gray-50 border-t border-gray-100">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => form.reset()}
                            className="h-12 px-8 font-medium border-gray-300 hover:bg-gray-50"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-12 px-8 font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Salvando...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Cadastrar Alojamento
                                </div>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
