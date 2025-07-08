"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Building2, Plus, List } from "lucide-react"
import RepublicForm from "./RepublicForm"
import RepublicList from "./RepublicList"

export default function AlojamentosPage() {
    const [activeTab, setActiveTab] = useState<"form" | "list">("form")

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <Building2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestão de Alojamentos</h1>
                    <p className="text-gray-600 text-lg">Cadastre e gerencie propriedades e repúblicas</p>
                </div>

                {/* Navigation Tabs */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                variant={activeTab === "form" ? "default" : "outline"}
                                onClick={() => setActiveTab("form")}
                                className={`h-12 px-6 font-medium ${activeTab === "form"
                                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                                        : "border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                                    }`}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Cadastrar Alojamento
                            </Button>
                            <Button
                                variant={activeTab === "list" ? "default" : "outline"}
                                onClick={() => setActiveTab("list")}
                                className={`h-12 px-6 font-medium ${activeTab === "list"
                                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                                        : "border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                                    }`}
                            >
                                <List className="w-4 h-4 mr-2" />
                                Listar Alojamentos
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Content */}
                {activeTab === "form" ? <RepublicForm /> : <RepublicList />}
            </div>
        </div>
    )
}
