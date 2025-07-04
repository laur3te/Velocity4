"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PencilIcon, SearchIcon, Building2, MapPin, Users } from "lucide-react"

interface Republic {
  id: number
  street: string
  number: string
  neighborhood: string
  city: string
  postalCode: string
  residents: number
}

export default function RepublicList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [republics, setRepublics] = useState<Republic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAlojamentos = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300"
        const response = await fetch(`${apiUrl}/alojamento`)

        if (!response.ok) throw new Error("Erro ao buscar dados")

        const data = await response.json()
        setRepublics(data)
        setLoading(false)
      } catch (err) {
        setError("Erro ao carregar os alojamentos.")
        setLoading(false)
      }
    }

    fetchAlojamentos()
  }, [])

  const filteredRepublics = republics.filter((r) =>
    `${r.street} ${r.number} ${r.neighborhood} ${r.city}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Alojamentos Cadastrados</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
            {filteredRepublics.length} {filteredRepublics.length === 1 ? "registro" : "registros"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por endereço, bairro ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Carregando alojamentos...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-900">Endereço</TableHead>
                  <TableHead className="font-semibold text-gray-900">Bairro</TableHead>
                  <TableHead className="font-semibold text-gray-900">Cidade</TableHead>
                  <TableHead className="font-semibold text-gray-900">CEP</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">Moradores</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRepublics.length > 0 ? (
                  filteredRepublics.map((republic) => (
                    <TableRow key={republic.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-900">
                            {republic.street}, {republic.number}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">{republic.neighborhood}</TableCell>
                      <TableCell className="text-gray-700">{republic.city}</TableCell>
                      <TableCell className="text-gray-700 font-mono">{republic.postalCode}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                          <Users className="w-3 h-3 mr-1" />
                          {republic.residents}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Building2 className="w-12 h-12 text-gray-300" />
                        <div>
                          <p className="text-gray-500 font-medium">Nenhum alojamento encontrado</p>
                          <p className="text-gray-400 text-sm">Tente ajustar os termos de busca</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
