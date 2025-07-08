import Link from "next/link"
import { Building2, Car, Users, ArrowRight, TrendingUp, ClipboardListIcon, Route } from "lucide-react" // Importe o ícone Route
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Principal</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Visão geral do sistema de gestão de alojamentos, funcionários e veículos
          </p>
        </div>

        {/* Main Navigation Cards */}
        <div className="space-y-8 mb-12">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Acesso Rápido</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Alojamentos */}
            <Link href="/alojamentos" className="group">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Gerenciar Alojamentos
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Cadastre novos alojamentos, visualize a lista completa e gerencie propriedades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full h-12 font-medium border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all"
                  >
                    Acessar Alojamentos
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Funcionários */}
            <Link href="/funcionarios" className="group">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Gerenciar Funcionários
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Cadastre novos colaboradores, gerencie informações pessoais e alocações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full h-12 font-medium border-gray-200 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all"
                  >
                    Acessar Funcionários
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Veículos */}
            <Link href="/veiculos" className="group">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                      <Car className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    Gerenciar Veículos
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Cadastre novos veículos, controle a frota e gerencie informações da empresa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full h-12 font-medium border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all"
                  >
                    Acessar Veículos
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* CANTEIROS */}
            <Link href="/canteiros" className="group">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                      <TrendingUp className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                    Gerenciar Canteiros
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Cadastre novos canteiros, acompanhe e gerencie locais de obra.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full h-12 font-medium border-gray-200 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white group-hover:border-yellow-600 transition-all"
                  >
                    Acessar Canteiros
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* SERVIÇOS */}
            <Link href="/servico" className="group">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <ArrowRight className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    Gerenciar Serviços
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Cadastre serviços, defina destinos e vincule funcionários aos canteiros de trabalho.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full h-12 font-medium border-gray-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all"
                  >
                    Acessar Serviços
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* ORDEM DE SERVIÇO */}
            <Link href="/ordem-servico" className="group">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <ClipboardListIcon className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Cadastrar Ordem de Serviço
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Registre e gerencie as ordens de serviço, vinculando colaboradores e locais de trabalho.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full h-12 font-medium border-gray-200 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all"
                  >
                    Criar Ordem de Serviço
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* NOVO ITEM: GERENCIAMENTO DE ROTAS */}
            <Link href="/rotas" className="group"> {/* Ajuste o href para o caminho da sua tela de rotas */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                      <Route className="w-6 h-6 text-indigo-600" /> {/* Ícone para Rotas */}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    Gerenciar Rotas
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Planeje e otimize as rotas de transporte e logística.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full h-12 font-medium border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all"
                  >
                    Acessar Rotas
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

          </div>
        </div>
      </div>
    </div>
  )
}