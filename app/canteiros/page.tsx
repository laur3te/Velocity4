"use client"

import { useEffect, useState } from "react"
import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

type Canteiro = {
  id: number
  codigo: string
  responsavel: string
  cidade: string
  estado: string
  status: string
}

export default function CadastroCanteiros() {
  const [form, setForm] = useState({
    codigo: "",
    responsavel: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    status: ""
  })

  const [loading, setLoading] = useState(false)
  const [canteiros, setCanteiros] = useState<Canteiro[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (name === "cep" && value.length === 9) {
      fetch(`https://viacep.com.br/ws/${value}/json/`)
        .then(res => res.json())
        .then(data => {
          if (!data.erro) {
            setForm(prev => ({
              ...prev,
              rua: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              estado: data.uf
            }))
          }
        })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/canteiros`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      if (!res.ok) throw new Error("Erro ao cadastrar o canteiro.")

      alert("✅ Canteiro cadastrado com sucesso!")

      setForm({
        codigo: "",
        responsavel: "",
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        status: ""
      })

      buscarCanteiros()
    } catch (error) {
      console.error("Erro:", error)
      alert("❌ Falha ao cadastrar canteiro.")
    } finally {
      setLoading(false)
    }
  }

  const buscarCanteiros = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/canteiros`)
      .then(res => res.json())
      .then(data => setCanteiros(data))
      .catch(err => {
        console.error("Erro ao buscar canteiros:", err)
        alert("Erro ao buscar canteiros")
      })
  }

  useEffect(() => {
    buscarCanteiros()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Cabeçalho */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-black">Gestão de Canteiros</h1>
          <p className="text-black">Cadastre e visualize locais de obra</p>
        </div>

        {/* Formulário */}
        <Card className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "codigo", label: "Código do Canteiro" },
              { name: "responsavel", label: "Responsável" },
              { name: "cep", label: "CEP" },
              { name: "rua", label: "Rua" },
              { name: "numero", label: "Número" },
              { name: "complemento", label: "Complemento" },
              { name: "bairro", label: "Bairro" },
              { name: "cidade", label: "Cidade" },
              { name: "estado", label: "Estado" },
            ].map(({ name, label }) => (
              <div key={name}>
                <Label className="text-black font-semibold">{label}</Label>
                <Input
                  name={name}
                  value={form[name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={label}
                  className="bg-white text-black border border-gray-300"
                  required={name !== "complemento"}
                />
              </div>
            ))}

            <div>
              <Label className="text-black font-semibold">Status</Label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full text-black bg-white border border-gray-300 rounded-md p-2"
                required
              >
                <option value="">Selecione o status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white" disabled={loading}>
                {loading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Lista de Canteiros */}
        <Card className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-black">📋 Canteiros Cadastrados</h2>
          <table className="min-w-full text-sm text-left text-black">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-2">Código</th>
                <th className="p-2">Responsável</th>
                <th className="p-2">Cidade</th>
                <th className="p-2">UF</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {canteiros.map(c => (
                <tr key={c.id} className="border-t even:bg-gray-50 hover:bg-gray-100 transition">
                  <td className="p-2">{c.codigo}</td>
                  <td className="p-2">{c.responsavel}</td>
                  <td className="p-2">{c.cidade}</td>
                  <td className="p-2">{c.estado}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.status === "ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
              {canteiros.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">Nenhum canteiro cadastrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
