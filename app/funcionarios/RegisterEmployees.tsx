"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { User, Building2, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const validarCPF = (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, "")
    if (cleaned.length !== 11) return false
    if (/^(\d)\1{10}$/.test(cleaned)) return false

    let sum = 0
    for (let i = 0; i < 9; i++) {
        sum += Number.parseInt(cleaned[i]) * (10 - i)
    }
    let digit1 = 11 - (sum % 11)
    if (digit1 >= 10) digit1 = 0

    sum = 0
    for (let i = 0; i < 10; i++) {
        sum += Number.parseInt(cleaned[i]) * (11 - i)
    }
    let digit2 = 11 - (sum % 11)
    if (digit2 >= 10) digit2 = 0

    return Number.parseInt(cleaned[9]) === digit1 && Number.parseInt(cleaned[10]) === digit2
}

const formatarCPF = (value: string): string => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`
}

// ✅ useEffect atualizado para buscar alojamentos da rota correta
const formSchema = z.object({
    nomeCompleto: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
    perfil: z.string().min(1, { message: "Selecione um perfil" }),
    matricula: z.string().min(1, { message: "Matrícula é obrigatória" }),
    cpf: z
        .string()
        .min(14, { message: "CPF deve ter 11 dígitos" })
        .max(14, { message: "CPF deve ter 11 dígitos" })
        .refine((cpf) => validarCPF(cpf), {
            message: "CPF inválido. Verifique os dígitos informados.",
        }),
    funcao: z.string().min(1, { message: "Função é obrigatória" }),
    status: z.string().min(1, { message: "Status é obrigatório" }),
    alocacao: z.string().min(1, { message: "Selecione uma alocação" }),
})

type FormValues = z.infer<typeof formSchema>

type AlojamentoOption = {
    value: string
    label: string
}

const perfisOptions = [
    { value: "colaborador", label: "Colaborador" },
    { value: "gerente", label: "Gerente" },
    { value: "motorista", label: "Motorista" },
    { value: "administrativo", label: "Administrativo" },
    { value: "supervisor", label: "Supervisor" },
]

const statusOptions = [
    { value: "ativo", label: "Ativo" },
    { value: "afastado", label: "Afastado" },
    { value: "desligado", label: "Desligado" },
]

export default function CadastroTrabalhadores() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [alocacaoOptions, setAlocacaoOptions] = useState<AlojamentoOption[]>([])
    const [isLoadingAlocacoes, setIsLoadingAlocacoes] = useState(true)

    useEffect(() => {
        const fetchAlojamentos = async () => {
            try {
                setIsLoadingAlocacoes(true)
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300"

                const response = await fetch(`${apiUrl}/alojamento`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

                if (response.ok) {
                    const data = await response.json()
                    const opcoesFormatadas: AlojamentoOption[] = data.map((alo: any) => ({
                        value: String(alo.id),
                        label: alo.street, // <- nome que vem da rota GET atual
                    }))
                    setAlocacaoOptions(opcoesFormatadas)
                } else {
                    setAlocacaoOptions([])
                }
            } catch (err) {
                setAlocacaoOptions([])
            } finally {
                setIsLoadingAlocacoes(false)
            }
        }

        fetchAlojamentos()
    }, [])

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nomeCompleto: "",
            perfil: "",
            matricula: "",
            cpf: "",
            funcao: "",
            status: "ativo",
            alocacao: "",
        },
        mode: "onChange",
    })

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true)

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300"

            const response = await fetch(`${apiUrl}/funcionarios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: data.nomeCompleto,
                    perfil: data.perfil,
                    matricula: data.matricula,
                    cpf: data.cpf,
                    funcao: data.funcao,
                    status: data.status,
                    alojamento_id: data.alocacao,
                }),
            })

            if (response.ok) {
                const alocacaoSelecionada =
                    alocacaoOptions.find((option) => option.value === data.alocacao)?.label || "não especificada"

                toast.success(
                    `Cadastro realizado com sucesso! O colaborador ${data.nomeCompleto} foi cadastrado na alocação: ${alocacaoSelecionada}`,
                    { duration: 5000 },
                )

                alert(`✅ Funcionário ${data.nomeCompleto} cadastrado com sucesso!`)

                form.reset()
            } else {
                toast.error("Não foi possível cadastrar o funcionário. Tente novamente.")
            }
        } catch (err) {
            toast.error("Erro de conexão. Verifique sua internet e tente novamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Cadastro de Trabalhadores</h1>
                    <p className="text-gray-600 text-lg">Preencha os dados do novo colaborador</p>
                </div>

                {/* Main Form Card */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="p-8 space-y-8">
                                {/* Personal Data Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <User className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900">Dados Pessoais</h2>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="nomeCompleto"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">Nome completo</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Digite o nome completo do colaborador"
                                                        {...field}
                                                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="perfil"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">Perfil</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 text-gray-900">
                                                                <SelectValue placeholder="Selecione um perfil" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-white">
                                                            {perfisOptions.map((option) => (
                                                                <SelectItem className="text-gray-700" key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">Status</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 text-gray-900">
                                                                <SelectValue placeholder="Selecione um status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-white">
                                                            {statusOptions.map((option) => (
                                                                <SelectItem className="text-gray-700" key={option.value} value={option.value}>
                                                                    <div className="flex items-center gap-2">
                                                                        <Badge
                                                                            variant={
                                                                                option.value === "ativo"
                                                                                    ? "default"
                                                                                    : option.value === "afastado"
                                                                                        ? "secondary"
                                                                                        : "destructive"
                                                                            }
                                                                            className="w-2 h-2 p-0 rounded-full"
                                                                        />
                                                                        {option.label}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="matricula"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">Matrícula</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Digite o número de matrícula"
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
                                            name="cpf"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">CPF</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="000.000.000-00"
                                                            maxLength={14}
                                                            {...field}
                                                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                                            onChange={(e) => {
                                                                const formatted = formatarCPF(e.target.value)
                                                                field.onChange(formatted)
                                                            }}
                                                            onBlur={() => {
                                                                form.trigger("cpf")
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="funcao"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">Função</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Digite a função do colaborador"
                                                        {...field}
                                                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Allocation Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Building2 className="w-4 h-4 text-green-600" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900">Alocação</h2>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="alocacao"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">Alojamento</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger
                                                            className="h-12 border-gray-200 focus:border-blue-500 text-gray-900"
                                                            disabled={isLoadingAlocacoes}
                                                        >
                                                            <SelectValue
                                                                placeholder={
                                                                    isLoadingAlocacoes ? "Carregando alojamentos..." : "Selecione um alojamento"
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-white">
                                                        {alocacaoOptions.map((option) => (
                                                            <SelectItem className="text-gray-700" key={option.value} value={option.value}>
                                                                <div className="flex items-center gap-2">
                                                                    <Building2 className="w-4 h-4 text-green-800" />
                                                                    {option.label}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                                                    <Building2 className="w-3 h-3" />
                                                    Selecione o alojamento onde o trabalhador será alocado
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
                                            Salvar Cadastro
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
