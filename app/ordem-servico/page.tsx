"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ClipboardListIcon, Users, Building2, MapPin, Briefcase } from "lucide-react" // Ícones Lucide React

// Interfaces para os tipos de dados do banco
interface Funcionario {
  id: number;
  nome: string;
  matricula: string;
  alojamento_id: number | null; // Adicionado alojamento_id para buscar os detalhes do alojamento
}

interface Alojamento {
  id: number;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  moradores: number;
  ativa: boolean;
}

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
  status: 'ativo' | 'inativo';
}

interface ServicoDb { // Renomeado para evitar conflito com "Serviço" como um conceito
  id: number;
  funcao: string; // O que o seu banco chama de 'funcao'
  canteiro_id: number;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
}

export default function CadastroOrdemServico() {
  // Estados para dados do banco
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [servicosDoBanco, setServicosDoBanco] = useState<ServicoDb[]>([]); // Renomeado
  const [canteiros, setCanteiros] = useState<Canteiro[]>([]);
  const [alojamentos, setAlojamentos] = useState<Alojamento[]>([]); // Novo estado para alojamentos

  // Estados de carregamento e erro
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(true);
  const [errorFuncionarios, setErrorFuncionarios] = useState<string | null>(null);
  const [loadingServicos, setLoadingServicos] = useState(true);
  const [errorServicos, setErrorServicos] = useState<string | null>(null);
  const [loadingCanteiros, setLoadingCanteiros] = useState(true);
  const [errorCanteiros, setErrorCanteiros] = useState<string | null>(null);
  const [loadingAlojamentos, setLoadingAlojamentos] = useState(true); // Novo
  const [errorAlojamentos, setErrorAlojamentos] = useState<string | null>(null); // Novo


  // Colaborador
  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState<string | undefined>(undefined);
  const [selectedFuncionarioData, setSelectedFuncionarioData] = useState<Funcionario | null>(null);
  const [funcionarioMatricula, setFuncionarioMatricula] = useState('');
  const [funcionarioRepublica, setFuncionarioRepublica] = useState(''); // Nome/ID da República
  const [funcionarioRua, setFuncionarioRua] = useState('');
  const [funcionarioCep, setFuncionarioCep] = useState('');
  const [funcionarioNumero, setFuncionarioNumero] = useState('');
  const [funcionarioBairro, setFuncionarioBairro] = useState('');

  // Serviço
  const [selectedServicoId, setSelectedServicoId] = useState<string | undefined>(undefined); // ID do serviço selecionado
  const [selectedServicoData, setSelectedServicoData] = useState<ServicoDb | null>(null); // Dados do serviço selecionado
  const [codigoServico, setCodigoServico] = useState(''); // Campo "Código do serviço"

  // Canteiro (associado ao serviço, não mais um select livre)
  const [canteiroServicoId, setCanteiroServicoId] = useState<string | undefined>(undefined); // ID do canteiro VINCULADO ao serviço selecionado
  const [canteiroServicoData, setCanteiroServicoData] = useState<Canteiro | null>(null); // Dados do canteiro vinculado ao serviço
  const [canteiroRua, setCanteiroRua] = useState('');
  const [canteiroCep, setCanteiroCep] = useState('');
  const [canteiroNumero, setCanteiroNumero] = useState('');
  const [canteiroBairro, setCanteiroBairro] = useState('');

  // 1. Fetch Funcionários
  useEffect(() => {
    async function fetchFuncionarios() {
      try {
        const response = await fetch("http://localhost:3001/funcionarios"); // ✅ Rota corrigida
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Funcionario[] = await response.json();
        setFuncionarios(data);
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
        setErrorFuncionarios("Não foi possível carregar os funcionários.");
      } finally {
        setLoadingFuncionarios(false);
      }
    }
    fetchFuncionarios();
  }, []);

  // 2. Fetch Serviços (tabela `servicos`)
  useEffect(() => {
    async function fetchServicos() {
      try {
        const response = await fetch("http://localhost:3001/servicos"); // ✅ Rota corrigida
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ServicoDb[] = await response.json();
        setServicosDoBanco(data);
      } catch (error) {
        console.error("Erro ao buscar serviços existentes:", error);
        setErrorServicos("Não foi possível carregar os serviços.");
      } finally {
        setLoadingServicos(false);
      }
    }
    fetchServicos();
  }, []);

  // 3. Fetch Canteiros (para preencher dados do canteiro vinculado ao serviço)
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
        setErrorCanteiros("Não foi possível carregar os canteiros.");
      } finally {
        setLoadingCanteiros(false);
      }
    }
    fetchCanteiros();
  }, []);

  // 4. Fetch Alojamentos (para preencher dados da república do funcionário)
  useEffect(() => {
    async function fetchAlojamentos() {
      try {
        const response = await fetch("http://localhost:3001/funcionarios/alojamentos"); // Rota auxiliar em funcionarios.js
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Alojamento[] = await response.json();
        setAlojamentos(data);
      } catch (error) {
        console.error("Erro ao buscar alojamentos:", error);
        setErrorAlojamentos("Não foi possível carregar os dados das repúblicas.");
      } finally {
        setLoadingAlojamentos(false);
      }
    }
    fetchAlojamentos();
  }, []);


  // Efeito para preencher dados do funcionário selecionado
  useEffect(() => {
    if (selectedFuncionarioId) {
      const func = funcionarios.find(f => f.id.toString() === selectedFuncionarioId);
      if (func) {
        setSelectedFuncionarioData(func);
        setFuncionarioMatricula(func.matricula || '');

        // Preencher dados da República (Alojamento)
        if (func.alojamento_id) {
          const alojamento = alojamentos.find(a => a.id === func.alojamento_id);
          if (alojamento) {
            setFuncionarioRepublica(alojamento.id.toString()); // Ou alojamento.nome se tivesse
            setFuncionarioRua(alojamento.rua || '');
            setFuncionarioCep(alojamento.cep || '');
            setFuncionarioNumero(alojamento.numero || '');
            setFuncionarioBairro(alojamento.bairro || '');
          } else {
            // Limpa se alojamento não encontrado
            setFuncionarioRepublica('');
            setFuncionarioRua('');
            setFuncionarioCep('');
            setFuncionarioNumero('');
            setFuncionarioBairro('');
          }
        } else {
          // Limpa se o funcionário não tem alojamento_id
          setFuncionarioRepublica('');
          setFuncionarioRua('');
          setFuncionarioCep('');
          setFuncionarioNumero('');
          setFuncionarioBairro('');
        }
      }
    } else {
      setSelectedFuncionarioData(null);
      setFuncionarioMatricula('');
      setFuncionarioRepublica('');
      setFuncionarioRua('');
      setFuncionarioCep('');
      setFuncionarioNumero('');
      setFuncionarioBairro('');
    }
  }, [selectedFuncionarioId, funcionarios, alojamentos]); // Adicione alojamentos como dependência

  // Efeito para preencher dados do serviço selecionado e seu canteiro
  useEffect(() => {
    if (selectedServicoId) {
      const servico = servicosDoBanco.find(s => s.id.toString() === selectedServicoId);
      if (servico) {
        setSelectedServicoData(servico);
        setCodigoServico(servico.id.toString()); // Ou outro código se 'servicos' tiver um
        setCanteiroServicoId(servico.canteiro_id.toString()); // Define o canteiro ID do serviço

        // Preenche os dados do canteiro associado a este serviço
        const canteiroAssociado = canteiros.find(c => c.id === servico.canteiro_id);
        if (canteiroAssociado) {
          setCanteiroServicoData(canteiroAssociado);
          setCanteiroRua(canteiroAssociado.rua || '');
          setCanteiroCep(canteiroAssociado.cep || '');
          setCanteiroNumero(canteiroAssociado.numero || '');
          setCanteiroBairro(canteiroAssociado.bairro || '');
        } else {
          // Limpa se canteiro não encontrado
          setCanteiroServicoData(null);
          setCanteiroRua('');
          setCanteiroCep('');
          setCanteiroNumero('');
          setCanteiroBairro('');
        }
      }
    } else {
      setSelectedServicoData(null);
      setCodigoServico('');
      setSelectedServicoId(undefined); // Limpa o Select
      setCanteiroServicoId(undefined); // Limpa o canteiro ID do serviço
      setCanteiroServicoData(null);
      setCanteiroRua('');
      setCanteiroCep('');
      setCanteiroNumero('');
      setCanteiroBairro('');
    }
  }, [selectedServicoId, servicosDoBanco, canteiros]);


  const handleFuncionarioSelect = (value: string) => {
    setSelectedFuncionarioId(value);
  };

  const handleServicoSelect = (value: string) => {
    setSelectedServicoId(value);
  };

  const handleSalvar = async () => {
  if (!selectedFuncionarioId || !selectedServicoId) {
    alert("Por favor, selecione um colaborador e um serviço.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3001/ordens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        funcionario_id: parseInt(selectedFuncionarioId),
        servico_id: parseInt(selectedServicoId),
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao cadastrar ordem de serviço.");
    }

    alert("Ordem de serviço cadastrada com sucesso!");

    // Limpa os selects
    setSelectedFuncionarioId(undefined);
    setSelectedServicoId(undefined);
  } catch (error) {
    console.error("Erro ao salvar ordem:", error);
    alert("Erro ao cadastrar ordem de serviço.");
  }
};


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Ícone principal no topo: Ordem de Serviço */}
      <div className="mb-6 bg-purple-100 p-4 rounded-full">
        <ClipboardListIcon className="h-10 w-10 text-purple-600" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Cadastro de Ordem de Serviço</h1>
      <p className="text-gray-600 text-center mb-10">Preencha os dados abaixo para registrar uma nova ordem de serviço.</p>

      <div className="max-w-4xl w-full bg-white shadow-xl rounded-xl p-8 sm:p-10 lg:p-12">
        {/* REMOVIDO: Campo Código do OS */}

        {/* Seção 1: Dados do Colaborador */}
        <div className="mb-8">
          <div className="flex items-center text-gray-800 mb-6 border-b pb-4">
            <Users className="h-6 w-6 mr-3 text-gray-600" />
            <h2 className="text-xl font-semibold">Dados do Colaborador</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label htmlFor="colaborador" className="text-sm font-medium text-gray-700">Colaborador:</Label>
              <Select onValueChange={handleFuncionarioSelect} value={selectedFuncionarioId}>
                <SelectTrigger className="flex items-center justify-between block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 py-2 text-gray-900">
                  <SelectValue placeholder="Selecione um colaborador" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 text-gray-900 shadow-lg rounded-md border border-gray-200">
                  {loadingFuncionarios && <SelectItem value="loading" disabled>Carregando funcionários...</SelectItem>}
                  {errorFuncionarios && <SelectItem value="error" disabled className="text-red-500">{errorFuncionarios}</SelectItem>}
                  {!loadingFuncionarios && !errorFuncionarios && funcionarios.length === 0 && (
                    <SelectItem value="no-funcionarios" disabled>Nenhum funcionário encontrado.</SelectItem>
                  )}
                  {funcionarios.map((f: Funcionario) => (
                    <SelectItem key={f.id} value={f.id.toString()}>{f.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="matricula" className="text-sm font-medium text-gray-700">Matrícula:</Label>
              <Input
                id="matricula"
                placeholder="Matrícula do colaborador"
                value={funcionarioMatricula}
                readOnly={true} // Sempre readOnly, preenchido auto
                className={`block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-gray-100 cursor-not-allowed`}
              />
            </div>

            {/* Campos de endereço do funcionário (República) */}
            <div className="space-y-2">
              <Label htmlFor="republica" className="text-sm font-medium text-gray-700">República:</Label>
              <Input
                id="republica"
                placeholder="ID da República"
                value={funcionarioRepublica}
                readOnly={true}
                className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="funcRua" className="text-sm font-medium text-gray-700">Rua:</Label>
              <Input
                id="funcRua"
                placeholder="Rua da República"
                value={funcionarioRua}
                readOnly={true}
                className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-x-8 md:col-span-2">
              <div className="space-y-2">
                <Label htmlFor="funcCep" className="text-sm font-medium text-gray-700">CEP:</Label>
                <Input
                  id="funcCep"
                  placeholder="CEP da República"
                  value={funcionarioCep}
                  readOnly={true}
                  className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="funcNumero" className="text-sm font-medium text-gray-700">Número:</Label>
                <Input
                  id="funcNumero"
                  placeholder="Número da República"
                  value={funcionarioNumero}
                  readOnly={true}
                  className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="funcBairro" className="text-sm font-medium text-gray-700">Bairro:</Label>
              <Input
                id="funcBairro"
                placeholder="Bairro da República"
                value={funcionarioBairro}
                readOnly={true}
                className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Seção 2: Dados do Serviço e Local */}
        <div>
          <div className="flex items-center text-gray-800 mb-6 border-b pb-4">
            <Briefcase className="h-6 w-6 mr-3 text-gray-600" />
            <h2 className="text-xl font-semibold">Dados do Serviço e Local</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label htmlFor="servico" className="text-sm font-medium text-gray-700">Serviço:</Label>
              <Select onValueChange={handleServicoSelect} value={selectedServicoId}>
                <SelectTrigger className="flex items-center justify-between block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 py-2 text-gray-900">
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 text-gray-900 shadow-lg rounded-md border border-gray-200">
                  {loadingServicos && <SelectItem value="loading" disabled>Carregando serviços...</SelectItem>}
                  {errorServicos && <SelectItem value="error" disabled className="text-red-500">{errorServicos}</SelectItem>}
                  {!loadingServicos && !errorServicos && servicosDoBanco.length === 0 && (
                    <SelectItem value="no-servicos" disabled>Nenhum serviço encontrado.</SelectItem>
                  )}
                  {servicosDoBanco.map((s: ServicoDb) => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.funcao}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigoServico" className="text-sm font-medium text-gray-700">Código do serviço:</Label>
              <Input
                id="codigoServico"
                placeholder="Código do serviço"
                value={codigoServico}
                readOnly={true} // Preenchido automaticamente pelo Select
                className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Canteiro (agora preenchido pelo serviço selecionado) */}
            <div className="space-y-2">
              <Label htmlFor="canteiro" className="text-sm font-medium text-gray-700">Canteiro:</Label>
              <Input
                id="canteiro"
                placeholder="Canteiro associado ao serviço"
                value={canteiroServicoData?.responsavel || ''} // Exibe o responsável do canteiro
                readOnly={true} // Sempre readOnly, preenchido auto
                className={`block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-gray-100 cursor-not-allowed`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="canteiroRua" className="text-sm font-medium text-gray-700">Rua:</Label>
              <Input
                id="canteiroRua"
                placeholder="Rua do canteiro"
                value={canteiroRua}
                readOnly={true}
                className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-x-8 md:col-span-2">
              <div className="space-y-2">
                <Label htmlFor="canteiroCep" className="text-sm font-medium text-gray-700">CEP:</Label>
                <Input
                  id="canteiroCep"
                  placeholder="CEP do canteiro"
                  value={canteiroCep}
                  readOnly={true}
                  className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="canteiroNumero" className="text-sm font-medium text-gray-700">Número:</Label>
                <Input
                  id="canteiroNumero"
                  placeholder="Número do canteiro"
                  value={canteiroNumero}
                  readOnly={true}
                  className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="canteiroBairro" className="text-sm font-medium text-gray-700">Bairro:</Label>
              <Input
                id="canteiroBairro"
                placeholder="Bairro do canteiro"
                value={canteiroBairro}
                readOnly={true}
                className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Botões Salvar e Editar */}
        <div className="mt-10 flex justify-center gap-6">
          <Button
            onClick={handleSalvar}
            className="px-8 py-3 rounded-full bg-green-600 text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
            Salvar
            </Button>
          <Button
            className="px-8 py-3 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Editar
          </Button>
        </div>
      </div>
    </div>
  );
}