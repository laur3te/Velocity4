"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Car, Truck, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const formSchema = z.object({
    frota: z.string().min(1, { message: "Número da frota é obrigatório" }),
    tipoVeiculo: z.string().min(1, { message: "Selecione o tipo de veículo" }),
    placa: z
        .string()
        .min(7, { message: "Placa deve ter pelo menos 7 caracteres" })
        .max(8, { message: "Placa deve ter no máximo 8 caracteres" })
        .regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$|^[A-Z]{3}[0-9]{4}$/, {
            message: "Formato de placa inválido (ex: ABC1234 ou ABC1D23)",
        }),
    capacidade: z.string().min(1, { message: "Selecione a capacidade" }),
})

type FormValues = z.infer<typeof formSchema>

const tiposVeiculo = [
    { value: "transporte", label: "Transporte de Passageiros", icon: Car },
    { value: "carga", label: "Transporte de Carga", icon: Truck },
]

export default function CadastrarVeiculo() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [capacidadeOptions, setCapacidadeOptions] = useState<{ value: string; label: string }[]>([])

useEffect(() => {
  toast.success("Banco de dados conectado com sucesso!")
}, [])

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            frota: "",
            tipoVeiculo: "",
            placa: "",
            capacidade: "",
        },
        mode: "onChange",
    })

    const tipoVeiculo = form.watch("tipoVeiculo")

    useEffect(() => {
        if (tipoVeiculo === "transporte") {
            setCapacidadeOptions([
                { value: "2", label: "2 passageiros" },
                { value: "4", label: "4 passageiros" },
                { value: "5", label: "5 passageiros" },
                { value: "7", label: "7 passageiros" },
                { value: "15", label: "15 passageiros" },
                { value: "45", label: "45 passageiros" },
            ])
        } else if (tipoVeiculo === "carga") {
            setCapacidadeOptions([
                { value: "500", label: "500 kg" },
                { value: "1000", label: "1.000 kg" },
                { value: "3000", label: "3.000 kg" },
                { value: "5000", label: "5.000 kg" },
                { value: "10000", label: "10.000 kg" },
            ])
        } else {
            setCapacidadeOptions([])
        }
        form.setValue("capacidade", "")
    }, [tipoVeiculo, form])

    const onSubmit = async (data: FormValues) => {
    console.log("Dados enviados:", data)

        setIsSubmitting(true)
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL 
            const response = await fetch(`${apiUrl}/veiculos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    frota: data.frota,
                    tipo_veiculo: data.tipoVeiculo,
                    placa: data.placa.toUpperCase(),
                    capacidade: parseInt(data.capacidade),
                }),
            })
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `Erro HTTP: ${response.status}`)
            }
            const tipoLabel = tiposVeiculo.find((tipo) => tipo.value === data.tipoVeiculo)?.label || data.tipoVeiculo
            const capacidadeLabel = capacidadeOptions.find((cap) => cap.value === data.capacidade)?.label || data.capacidade

            toast.success(
                `Veículo cadastrado com sucesso! ${tipoLabel} - Placa: ${data.placa.toUpperCase()} - Capacidade: ${capacidadeLabel}`,
                { duration: 5000 }
            )
            form.reset()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
            toast.error(`Erro ao cadastrar veículo: ${errorMessage}`)
            console.error("Erro no cadastro:", err)
        } finally {
            setIsSubmitting(false)
        }

        alert("✅ Veículo cadastrado com sucesso!")
    }

    const formatPlaca = (value: string) => {
        const cleaned = value.replace(/[^A-Z0-9]/gi, "").toUpperCase()
        return cleaned.slice(0, 7)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 text-black">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                        <Car className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">Cadastro de Veículos</h1>
                    <p className="text-lg">Registre novos veículos na frota da empresa</p>
                </div>

                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <Car className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <h2 className="text-xl font-semibold">Informações do Veículo</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="frota" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-black">Número da Frota</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Digite o número da frota" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-black" />
                                            </FormItem>
                                        )} />

                                        <FormField control={form.control} name="tipoVeiculo" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-black">Tipo de Veículo</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione o tipo de veículo" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {tiposVeiculo.map((tipo) => {
                                                            const Icon = tipo.icon
                                                            return (
                                                                <SelectItem key={tipo.value} value={tipo.value} className=" bg-white text-black">
                                                                    <div className="flex items-center gap-2">
                                                                        <Icon className="w-4 h-4 text-emerald-600" />
                                                                        {tipo.label}
                                                                    </div>
                                                                </SelectItem>
                                                            )
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-black" />
                                            </FormItem>
                                        )} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="placa" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-black">Placa do Veículo</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="ABC1234 ou ABC1D23"
                                                        {...field}
                                                        onChange={(e) => {
                                                            const formatted = formatPlaca(e.target.value)
                                                            field.onChange(formatted)
                                                        }}
                                                        maxLength={7}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-black" />
                                                <p className="text-sm mt-1 text-black">Formato: ABC1234 (padrão antigo) ou ABC1D23 (Mercosul)</p>
                                            </FormItem>
                                        )} />

                                        <FormField control={form.control} name="capacidade" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-black">
                                                    {tipoVeiculo === "transporte"
                                                        ? "Capacidade de Passageiros"
                                                        : tipoVeiculo === "carga"
                                                        ? "Capacidade de Carga"
                                                        : "Capacidade"}
                                                </FormLabel>
                                                <Select value={field.value} onValueChange={(val) => form.setValue("capacidade", val)} disabled={!tipoVeiculo}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={!tipoVeiculo ? "Selecione primeiro o tipo de veículo" : "Selecione a capacidade"} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-white text-black shadow-md">
                                                    {capacidadeOptions.map((option) => (
                                                    <SelectItem
                                                         key={option.value}
                                                        value={option.value}
                                                         className="bg-white text-black hover:bg-emerald-100"
                                                         >
                                                        {option.label}
                                                        </SelectItem>
                                                         ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-black" />
                                                {tipoVeiculo && (
                                                    <p className="text-sm mt-1 text-black flex items-center gap-1">
                                                        {tipoVeiculo === "transporte" ? (
                                                            <><Car className="w-3 h-3" />Número máximo de passageiros</>
                                                        ) : (
                                                            <><Truck className="w-3 h-3" />Peso máximo de carga</>
                                                        )}
                                                    </p>
                                                )}
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between px-8 py-6 bg-gray-50 border-t border-gray-100">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => form.reset()}
                                    className="text-white bg-black hover:bg-gray-800 border-black"
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Salvando...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Cadastrar Veículo
                                        </div>
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </div>
    )
}
