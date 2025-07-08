"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Importe os componentes do Select
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { HomeIcon, BriefcaseIcon, ArrowRight } from "lucide-react";

// Defina a interface para o tipo Canteiro
interface Canteiro {
  id: number;
  codigo: string;
  responsavel: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  status: "ativo" | "inativo";
  data_cadastro: string;
}

export default function CadastroServico() {
  const [canteiros, setCanteiros] = useState<Canteiro[]>([]);
  const [loadingCanteiros, setLoadingCanteiros] = useState(true);
  const [errorCanteiros, setErrorCanteiros] = useState<string | null>(null);

  const [selectedCanteiroId, setSelectedCanteiroId] = useState<
    string | undefined
  >(undefined);
  const [selectedCanteiroData, setSelectedCanteiroData] =
    useState<Canteiro | null>(null);

  const [funcao, setFuncao] = useState("");
  const [rua, setRua] = useState("");
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");

  useEffect(() => {
    async function fetchCanteiros() {
      try {
        const response = await fetch("http://localhost:3001/canteiros");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Canteiro[] = await response.json();
        setCanteiros(data);
      } catch (error) {
        console.error("Erro ao buscar canteiros:", error);
        setErrorCanteiros(
          "Não foi possível carregar os canteiros. Tente novamente mais tarde."
        );
      } finally {
        setLoadingCanteiros(false);
      }
    }
    fetchCanteiros();
  }, []);

  useEffect(() => {
    if (selectedCanteiroId) {
      const canteiro = canteiros.find(
        (c) => c.id.toString() === selectedCanteiroId
      );
      if (canteiro) {
        setSelectedCanteiroData(canteiro);
        setRua(canteiro.rua || "");
        setCep(canteiro.cep || "");
        setNumero(canteiro.numero || "");
        setBairro(canteiro.bairro || "");
        setCidade(canteiro.cidade || "");
      }
    } else {
      setSelectedCanteiroData(null);
      setRua("");
      setCep("");
      setNumero("");
      setBairro("");
      setCidade("");
    }
  }, [selectedCanteiroId, canteiros]);

  const handleCanteiroSelect = (value: string) => {
    setSelectedCanteiroId(value);
  };

  const handleSubmit = async () => {
    if (
      !funcao ||
      !rua ||
      !numero ||
      !bairro ||
      !cidade ||
      !cep ||
      !selectedCanteiroId
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/servicos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          funcao,
          canteiro_id: Number(selectedCanteiroId),
          rua,
          numero,
          bairro,
          cidade,
          cep,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar serviço.");
      }

      alert("Serviço cadastrado com sucesso!");

      // Limpa o formulário
      setFuncao("");
      setSelectedCanteiroId(undefined);
      setRua("");
      setCep("");
      setNumero("");
      setBairro("");
      setCidade("");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao cadastrar serviço.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 bg-red-100 p-4 rounded-full">
        <ArrowRight className="h-10 w-10 text-red-600" />
      </div>
      <div className="w-full flex justify-end mb-4">
        <img
          src="/logo.png"
          alt="Logo Velocity4"
          className="h-20 w-auto rounded-full"
        />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
        Cadastro de Serviço
      </h1>
      <p className="text-gray-600 text-center mb-10">
        Preencha os dados abaixo para cadastrar um novo serviço.
      </p>

      <div className="max-w-4xl w-full bg-white shadow-xl rounded-xl p-8 sm:p-10 lg:p-12">
        <div className="mb-8">
          <div className="flex items-center text-gray-800 mb-6 border-b pb-4">
            <BriefcaseIcon className="h-6 w-6 mr-3 text-gray-600" />
            <h2 className="text-xl font-semibold">Informações do Serviço</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="funcao"
                className="text-sm font-medium text-gray-700"
              >
                Função a ser executada
              </Label>
              <Input
                id="funcao"
                placeholder="Ex: Eletricista"
                value={funcao}
                onChange={(e) => setFuncao(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="canteiro"
                className="text-sm font-medium text-gray-700"
              >
                Canteiro para realização
              </Label>
              <Select
                onValueChange={handleCanteiroSelect}
                value={selectedCanteiroId}
              >
                <SelectTrigger
                  // ✅ Ajustes no SelectTrigger para garantir a posição da seta e padding consistente
                  // Removi 'px-3 py-2' pois o Shadcn UI geralmente já tem um padding interno.
                  // Se a seta ainda estiver desalinhada, você pode precisar ajustar o padding via className ou no CSS do Shadcn UI.
                  className="flex items-center justify-between block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 text-gray-900"
                >
                  <SelectValue placeholder="Selecione um canteiro" />
                </SelectTrigger>
                <SelectContent
                  // ✅ Adicionado bg-white e z-50 para garantir sobreposição e fundo sólido
                  className="bg-white z-50 text-gray-900 shadow-lg rounded-md border border-gray-200"
                >
                  {loadingCanteiros && (
                    <SelectItem value="loading" disabled>
                      Carregando canteiros...
                    </SelectItem>
                  )}
                  {errorCanteiros && (
                    <SelectItem value="error" disabled className="text-red-500">
                      {errorCanteiros}
                    </SelectItem>
                  )}
                  {!loadingCanteiros &&
                    !errorCanteiros &&
                    canteiros.length === 0 && (
                      <SelectItem value="no-canteiros" disabled>
                        Nenhum canteiro encontrado.
                      </SelectItem>
                    )}
                  {canteiros.map((c: Canteiro) => (
                    // ✅ A classe text-gray-900 no SelectContent já resolve a cor
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.responsavel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Seção 2: Endereço para Realização */}
        <div>
          <div className="flex items-center text-gray-800 mb-6 border-b pb-4">
            <HomeIcon className="h-6 w-6 mr-3 text-gray-600" />
            <h2 className="text-xl font-semibold">Endereço para Realização</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="rua"
                className="text-sm font-medium text-gray-700"
              >
                Rua
              </Label>
              <Input
                id="rua"
                placeholder="Digite o nome da rua"
                value={rua}
                onChange={(e) =>
                  selectedCanteiroId ? {} : setRua(e.target.value)
                }
                readOnly={!!selectedCanteiroId}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 ${
                  selectedCanteiroId ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="cep"
                className="text-sm font-medium text-gray-700"
              >
                CEP
              </Label>
              <Input
                id="cep"
                placeholder="00000-000"
                value={cep}
                onChange={(e) =>
                  selectedCanteiroId ? {} : setCep(e.target.value)
                }
                readOnly={!!selectedCanteiroId}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 ${
                  selectedCanteiroId ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="numero"
                className="text-sm font-medium text-gray-700"
              >
                Número
              </Label>
              <Input
                id="numero"
                placeholder="123"
                value={numero}
                onChange={(e) =>
                  selectedCanteiroId ? {} : setNumero(e.target.value)
                }
                readOnly={!!selectedCanteiroId}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 ${
                  selectedCanteiroId ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="bairro"
                className="text-sm font-medium text-gray-700"
              >
                Bairro
              </Label>
              <Input
                id="bairro"
                placeholder="Digite o nome do bairro"
                value={bairro}
                onChange={(e) =>
                  selectedCanteiroId ? {} : setBairro(e.target.value)
                }
                readOnly={!!selectedCanteiroId}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 ${
                  selectedCanteiroId ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label
                htmlFor="cidade"
                className="text-sm font-medium text-gray-700"
              >
                Cidade
              </Label>
              <Input
                id="cidade"
                placeholder="Digite o nome da cidade"
                value={cidade}
                onChange={(e) =>
                  selectedCanteiroId ? {} : setCidade(e.target.value)
                }
                readOnly={!!selectedCanteiroId}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 ${
                  selectedCanteiroId ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-4">
          <Button
            variant="outline"
            className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md bg-green-600 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Cadastrar Serviço
          </Button>
        </div>
      </div>
    </div>
  );
}
