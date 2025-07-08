"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation, ArrowUpDown, Plus, Trash2, AlertCircle, ClipboardListIcon, Truck } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

// Interfaces (mantidas as mesmas)
interface Address {
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
}

interface Alojamento extends Address {
  id: number;
  moradores?: number;
  ativa?: boolean;
}

interface Canteiro extends Address {
  id: number;
  codigo: string;
  responsavel: string;
  complemento: string | null;
  estado: string;
  status: 'ativo' | 'inativo';
}

interface OrdemServico {
  id: number;
  data_criacao: string;
  funcionario_nome: string;
  funcionario_matricula: string;
  servico_funcao: string;
  servico_id: number;
  canteiro_id: number;
  canteiro_rua: string;
  canteiro_numero: string;
  canteiro_bairro: string;
  canteiro_cidade: string;
  canteiro_cep: string;
  canteiro_responsavel: string;
  canteiro_codigo: string;
}

interface Veiculo {
  id: number;
  frota: string;
  tipo_veiculo: string;
  placa: string;
  capacidade: number;
}

interface Waypoint {
  id: string;
  name: string;
  coordinates: [number, number];
  type: "alojamento" | "canteiro" | "ordem_servico";
  marker?: mapboxgl.Marker;
  originalData: Alojamento | Canteiro | OrdemServico;
}

interface RouteStats {
  total: number
  planned: number
  inProgress: number
  completed: number
}

export default function RouteManagementDashboard() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  const [alojamentos, setAlojamentos] = useState<Alojamento[]>([])
  const [canteirosDb, setCanteirosDb] = useState<Canteiro[]>([])
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([])
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])

  const [selectedPointType, setSelectedPointType] = useState<"alojamento" | "canteiro" | undefined>(undefined);
  const [selectedOriginDestId, setSelectedOriginDestId] = useState<string | undefined>(undefined);
  
  const [selectedOrdemServicoId, setSelectedOrdemServicoId] = useState<string | undefined>(undefined);
  const [selectedOrdemServicoData, setSelectedOrdemServicoData] = useState<OrdemServico | null>(null);

  const [selectedVeiculoId, setSelectedVeiculoId] = useState<string | undefined>(undefined);
  const [selectedVeiculoData, setSelectedVeiculoData] = useState<Veiculo | null>(null);

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]); 

  const [routes, setRoutes] = useState<any[]>([])
  const [stats, setStats] = useState<RouteStats>({
    total: 0,
    planned: 0,
    inProgress: 0,
    completed: 0,
  })

  const [totalDistanceKm, setTotalDistanceKm] = useState(0);
  const [totalDurationMinutes, setTotalDurationMinutes] = useState(0);

  const [loadingAlojamentos, setLoadingAlojamentos] = useState(true);
  const [errorAlojamentos, setErrorAlojamentos] = useState<string | null>(null);
  const [loadingCanteirosDb, setLoadingCanteirosDb] = useState(true);
  const [errorCanteirosDb, setErrorCanteirosDb] = useState<string | null>(null);
  const [loadingOrdensServico, setLoadingOrdensServico] = useState(true);
  const [errorOrdensServico, setErrorOrdensServico] = useState<string | null>(null);
  const [loadingVeiculos, setLoadingVeiculos] = useState(true);
  const [errorVeiculos, setErrorVeiculos] = useState<string | null>(null);


  // Efeito para inicializar o mapa Mapbox GL JS
  useEffect(() => {
    if (!mapContainer.current || map.current) return // Evita reinicialização do mapa

    if (!mapboxgl.accessToken) {
      console.error("Mapbox access token not set. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env.local file.")
      return
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-49.4636, -18.9653], // Coordenadas de Ituiutaba, MG
      zoom: 12,
      interactive: true,
    })

    // Adiciona controles de navegação (zoom e rotação) e fullscreen
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left')
    map.current.addControl(new mapboxgl.FullscreenControl());

    // Função de limpeza: remove o mapa ao desmontar o componente para evitar vazamentos de memória
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    }
  }, []) // Array de dependências vazio: executa apenas uma vez na montagem

  // Fetches de dados do backend (agrupados em um único useEffect)
  useEffect(() => {
    async function fetchAllData() {
      // Fetch Alojamentos
      try {
        const response = await fetch("http://localhost:3001/funcionarios/alojamentos");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: Alojamento[] = await response.json();
        setAlojamentos(data);
      } catch (error) { console.error("Erro ao buscar alojamentos:", error); setErrorAlojamentos("Não foi possível carregar os alojamentos."); } finally { setLoadingAlojamentos(false); }

      // Fetch Canteiros
      try {
        const response = await fetch("http://localhost:3001/canteiros");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: Canteiro[] = await response.json();
        setCanteirosDb(data);
      } catch (error) { console.error("Erro ao buscar canteiros:", error); setErrorCanteirosDb("Não foi possível carregar os canteiros."); } finally { setLoadingCanteirosDb(false); }

      // Fetch Ordens de Serviço
      try {
        const response = await fetch("http://localhost:3001/ordens"); // URL da sua rota de OS
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: OrdemServico[] = await response.json();
        setOrdensServico(data);
      } catch (error) { console.error("Erro ao buscar ordens de serviço:", error); setErrorOrdensServico("Não foi possível carregar as ordens de serviço."); } finally { setLoadingOrdensServico(false); }

      // Fetch Veículos
      try {
        const response = await fetch("http://localhost:3001/veiculos"); 
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: Veiculo[] = await response.json();
        setVeiculos(data);
      } catch (error) { console.error("Erro ao buscar veículos:", error); setErrorVeiculos("Não foi possível carregar os veículos."); } finally { setLoadingVeiculos(false); }
    }
    fetchAllData();
  }, []);


  // Função para geocodificar um endereço completo (Mapbox Geocoding API)
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      const encodedAddress = encodeURIComponent(address);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${mapboxgl.accessToken}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        return data.features[0].center; // Retorna [longitude, latitude]
      }
      console.warn("Endereço não encontrado via geocodificação:", address);
      return null;
    } catch (error) {
      console.error("Erro na geocodificação:", error);
      return null;
    }
  };

  // Função auxiliar para formatar um objeto de endereço em string para geocodificação
  const formatAddress = (addr: Address | OrdemServico): string => {
    // Se o objeto 'addr' tiver propriedades específicas de OrdemServico (que contém dados do canteiro),
    // usa os campos do canteiro da OS para formar o endereço.
    if ('canteiro_rua' in addr && 'canteiro_numero' in addr) {
      return `${addr.canteiro_rua}, ${addr.canteiro_numero}, ${addr.canteiro_bairro}, ${addr.canteiro_cidade}, ${addr.canteiro_cep}`;
    }
    // Caso contrário, trata como um objeto Address padrão (Alojamento ou Canteiro)
    return `${(addr as Address).rua}, ${(addr as Address).numero}, ${(addr as Address).bairro}, ${(addr as Address).cidade}, ${(addr as Address).cep}`;
  };


  // Adiciona um waypoint à lista de waypoints da rota
  const handleAddWaypoint = async () => {
    if (!selectedPointType || !selectedOriginDestId) {
      alert("Por favor, selecione um tipo de ponto e um alojamento/canteiro.");
      return;
    }

    let pointToAdd: Waypoint | undefined;
    let coordinates: [number, number] | null = null;
    let name: string = "";
    let originalData: Alojamento | Canteiro | undefined; 
    let addressToGeocode: Address | undefined; 


    // Lógica para obter os dados e endereço do ponto selecionado (Alojamento ou Canteiro)
    if (selectedPointType === "alojamento") {
      const alojamento = alojamentos.find(a => a.id.toString() === selectedOriginDestId);
      if (alojamento) {
        originalData = alojamento;
        name = `Alojamento: ${alojamento.rua}, ${alojamento.numero} (${alojamento.cidade})`;
        addressToGeocode = alojamento;
      }
    } else if (selectedPointType === "canteiro") {
      const canteiro = canteirosDb.find(c => c.id.toString() === selectedOriginDestId);
      if (canteiro) {
        originalData = canteiro;
        name = `Canteiro: ${canteiro.responsavel} (${canteiro.codigo})`;
        addressToGeocode = canteiro;
      }
    } 

    // Se temos um objeto de endereço válido, tentamos geocodificar
    if (addressToGeocode) {
        coordinates = await geocodeAddress(formatAddress(addressToGeocode));
    }

    // Se as coordenadas e dados originais foram obtidos com sucesso, cria o waypoint
    if (coordinates && name && originalData) { 
      pointToAdd = {
        id: selectedOriginDestId,
        name,
        coordinates,
        type: selectedPointType, // O tipo será 'alojamento' ou 'canteiro'
        originalData: originalData as Alojamento | Canteiro, // Cast para o tipo correto
      };

      // Adiciona o novo waypoint à lista, removendo qualquer duplicata (mesmo ID e tipo)
      setWaypoints(prev => {
        const existingPoint = prev.find(p => p.id === pointToAdd?.id && p.type === pointToAdd?.type);
        if (existingPoint && existingPoint.marker) {
          existingPoint.marker.remove(); // Remove o marcador antigo do mapa
        }
        const updated = prev.filter(p => p.id !== pointToAdd?.id || p.type !== pointToAdd?.type); // Filtra o antigo
        return [...updated, pointToAdd!]; // Adiciona o novo
      });

      // Adiciona o marcador visual no mapa
      let markerColor = "#808080"; // Cor padrão (não deve ser usada para alojamento/canteiro)
      if (selectedPointType === "alojamento") markerColor = "#3b82f6"; // Azul para Alojamento
      else if (selectedPointType === "canteiro") markerColor = "#ef4444"; // Vermelho para Canteiro

      const marker = new mapboxgl.Marker({ color: markerColor })
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<strong>${name}</strong>`))
        .addTo(map.current!);
      
      // Armazena a referência do marcador no objeto waypoint no estado
      setWaypoints(prev => prev.map(wp => wp.id === pointToAdd?.id && wp.type === pointToAdd?.type ? { ...wp, marker } : wp));

      // Centraliza o mapa no novo ponto
      map.current?.flyTo({ center: coordinates, zoom: 14 });

      // Limpa as seleções da UI para adicionar o próximo ponto
      setSelectedPointType(undefined);
      setSelectedOriginDestId(undefined);

    } else {
      alert(`Não foi possível geocodificar o ponto selecionado ou dados incompletos.`);
    }
  };

  // Remove um waypoint da lista e seu marcador do mapa
  const removeWaypointAndMarker = (id: string, type: "alojamento" | "canteiro" | "ordem_servico") => {
    setWaypoints(prevWaypoints => {
      const pointToRemove = prevWaypoints.find(p => p.id === id && p.type === type);
      if (pointToRemove && pointToRemove.marker) {
        pointToRemove.marker.remove(); // Remove o marcador do mapa
      }
      const updatedWaypoints = prevWaypoints.filter(p => p.id !== id || p.type !== type);

      // Lógica para limpar a rota principal se não houver pontos suficientes
      if (updatedWaypoints.length < 2) { 
          if (map.current && map.current.getLayer("main-route")) {
              map.current.removeLayer("main-route");
              map.current.removeSource("main-route");
          }
          setRoutes([]);
          setTotalDistanceKm(0);
          setTotalDurationMinutes(0);
          updateStats(0);
      }
      
      return updatedWaypoints; // Retorna o novo array filtrado
    });
  };

  // Move um waypoint para cima ou para baixo na lista
  const moveWaypoint = (id: string, type: "alojamento" | "canteiro" | "ordem_servico", direction: "up" | "down") => {
    setWaypoints((prev: Waypoint[]) => { 
      const index = prev.findIndex(p => p.id === id && p.type === type);
      if (index === -1) return prev;

      const newArray = [...prev];
      const newIndex = direction === "up" ? index - 1 : index + 1;

      if (newIndex >= 0 && newIndex < newArray.length) {
        [newArray[index], newArray[newIndex]] = [newArray[newIndex], newArray[index]];
      }

      return newArray;
    });
  };

  // Gera a rota principal no mapa usando todos os waypoints e a OS atribuída
  const generateMainRoute = async () => {
    // Verificar se há pelo menos 2 waypoints para gerar a rota
    if (waypoints.length < 2) {
      alert("Adicione pelo menos dois pontos (saída e chegada) para gerar a rota principal.");
      return;
    }

    // Limpar a rota principal antiga do mapa, se existir
    if (map.current && map.current.getLayer("main-route")) {
        map.current.removeLayer("main-route");
        map.current.removeSource("main-route");
    }

    // Configurar os pontos para a Mapbox Directions API
    const originCoords = waypoints[0].coordinates.join(',');
    const destinationCoords = waypoints[waypoints.length - 1].coordinates.join(',');

    let waypointsParam = "";
    if (waypoints.length > 2) {
        const intermediateWaypoints = waypoints.slice(1, -1).map(wp => wp.coordinates.join(','));
        waypointsParam = `;${intermediateWaypoints.join(';')}`;
    }

    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords}${waypointsParam};${destinationCoords}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const mainRouteGeometry = data.routes[0].geometry;
        const mainRouteDistance = data.routes[0].distance / 1000; // Converte metros para km
        const mainRouteDuration = data.routes[0].duration / 60; // Converte segundos para minutos

        // Atualiza os estados de quilometragem e tempo total
        setTotalDistanceKm(mainRouteDistance);
        setTotalDurationMinutes(mainRouteDuration);
        setRoutes([data.routes[0]]); // Armazena a rota principal gerada
        updateStats(1); // Atualiza estatísticas (1 rota gerada)

        // Desenha a rota principal no mapa
        drawMainRoute(mainRouteGeometry, "main-route", "#007aff", 6);
        // Ajusta o zoom do mapa para os limites da rota
        // Usando mapboxgl.LngLatBounds.convert() de forma robusta e com padding
        map.current?.fitBounds(mapboxgl.LngLatBounds.convert(mainRouteGeometry.bbox || mainRouteGeometry.coordinates), { padding: 50 });

        // Lógica para marcar a Ordem de Serviço atribuída no mapa (se selecionada)
        if (selectedOrdemServicoData) {
            const canteiroDaOs = canteirosDb.find(c => c.id === selectedOrdemServicoData.canteiro_id);
            if (canteiroDaOs) {
                const osAddress: Address = {
                    cep: canteiroDaOs.cep,
                    rua: canteiroDaOs.rua,
                    numero: canteiroDaOs.numero,
                    bairro: canteiroDaOs.bairro,
                    cidade: canteiroDaOs.cidade
                };
                const osCoordinates = await geocodeAddress(formatAddress(osAddress));
                if (osCoordinates) {
                    const osWaypointName = `OS: ${selectedOrdemServicoData.id} - ${selectedOrdemServicoData.servico_funcao} (Canteiro: ${canteiroDaOs.responsavel})`;
                    
                  

                    // Cria e adiciona o novo marcador da OS
                    const osMarker = new mapboxgl.Marker({ color: "#6a0dad" }) // Roxo para Ordem de Serviço
                        .setLngLat(osCoordinates)
                        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<strong>${osWaypointName}</strong>`))
                        .addTo(map.current!);
                }
            }
        }

      } else {
        alert("Não foi possível gerar a rota com os pontos selecionados.");
        setRoutes([]);
        updateStats(0);
        setTotalDistanceKm(0);
        setTotalDurationMinutes(0);
      }
    } catch (error) {
      console.error("Erro ao gerar a rota principal:", error);
      alert("Ocorreu um erro ao gerar a rota. Verifique a consola.");
      setRoutes([]);
      setTotalDistanceKm(0);
      setTotalDurationMinutes(0);
    }
  };

  // Desenha a linha da rota principal no mapa
  const drawMainRoute = (geometry: any, layerId: string, color: string, width: number) => {
    if (!map.current) return;

    const sourceId = layerId;

    // Remove camada e fonte existentes, se houver
    if (map.current.getLayer(sourceId)) {
        map.current.removeLayer(sourceId);
    }
    if (map.current.getSource(sourceId)) {
        map.current.removeSource(sourceId);
    }

    // Adiciona a fonte GeoJSON com a geometria da rota
    map.current.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {}, // Propriedades vazias para o GeoJSON Feature
        geometry,
      },
    });

    // Adiciona a camada de linha para exibir a rota
    map.current.addLayer({
      id: sourceId,
      type: "line",
      source: sourceId,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": color, // Cor da linha
        "line-width": width, // Largura da linha
      },
    });
  };

  // Atualiza as estatísticas exibidas na UI
  const updateStats = (totalRoutesGenerated: number) => {
    setStats({
      total: totalRoutesGenerated,
      planned: totalRoutesGenerated > 0 ? 1 : 0, // Se 1 rota gerada, ela é "planejada"
      inProgress: 0, // Lógica mais complexa para status real
      completed: 0,  // Lógica mais complexa para status real
    });
  };

  // Bloco de aviso se o token do Mapbox não estiver configurado
  if (!mapboxgl.accessToken) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Configuração necessária:</strong> Para usar este sistema, você precisa:
              <br />
              1. Obter um token da API do Mapbox em{" "}
              <a
                href="https://account.mapbox.com/access-tokens/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                https://account.mapbox.com/access-tokens/
              </a>
              <br />
              2. Adicionar a variável de ambiente:{" "}
              <code>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=sua_chave_aqui</code>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da Dashboard */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Navigation className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Gerenciamento de Rotas</h1>
                <p className="text-sm text-gray-500">Sistema integrado com Mapbox API</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal: Sidebar e Mapa */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar para Pontos e Controles (col-span-1) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card: Adicionar Ponto à Rota */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Plus className="h-5 w-5 text-gray-600" />
                  <span>Adicionar Ponto à Rota</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Seleção de Tipo de Ponto (Alojamento ou Canteiro) */}
                <Select onValueChange={(value: "alojamento" | "canteiro") => {
                  setSelectedPointType(value);
                  setSelectedOriginDestId(undefined); // Resetar ID ao mudar o tipo
                }} value={selectedPointType}>
                  <SelectTrigger className="flex items-center justify-between block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 py-2 text-gray-900">
                    <SelectValue placeholder="Tipo de ponto" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 text-gray-900 shadow-lg rounded-md border border-gray-200">
                    <SelectItem value="alojamento">Alojamento</SelectItem>
                    <SelectItem value="canteiro">Canteiro</SelectItem>
                  </SelectContent>
                </Select>

                {/* Select para Alojamentos (condicional) */}
                {selectedPointType === "alojamento" && (
                  <Select onValueChange={setSelectedOriginDestId} value={selectedOriginDestId}>
                    <SelectTrigger className="flex items-center justify-between block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 py-2 text-gray-900">
                      <SelectValue placeholder="Selecione um alojamento" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50 text-gray-900 shadow-lg rounded-md border border-gray-200">
                      {loadingAlojamentos && <SelectItem value="loading" disabled>Carregando alojamentos...</SelectItem>}
                      {errorAlojamentos && <SelectItem value="error" disabled className="text-red-500">{errorAlojamentos}</SelectItem>}
                      {!loadingAlojamentos && !errorAlojamentos && alojamentos.length === 0 && (
                        <SelectItem value="no-alojamentos" disabled>Nenhum alojamento encontrado.</SelectItem>
                      )}
                      {alojamentos.map((aloj) => (
                        <SelectItem key={aloj.id} value={aloj.id.toString()}>
                          {aloj.rua}, {aloj.numero} - {aloj.cidade} (CEP: {aloj.cep})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {selectedPointType === "canteiro" && (
                  <Select onValueChange={setSelectedOriginDestId} value={selectedOriginDestId}>
                    <SelectTrigger className="flex items-center justify-between block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 py-2 text-gray-900">
                      <SelectValue placeholder="Selecione um canteiro" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50 text-gray-900 shadow-lg rounded-md border border-gray-200">
                      {loadingCanteirosDb && <SelectItem value="loading" disabled>Carregando canteiros...</SelectItem>}
                      {errorCanteirosDb && <SelectItem value="error" disabled className="text-red-500">{errorCanteirosDb}</SelectItem>}
                      {!loadingCanteirosDb && !errorCanteirosDb && canteirosDb.length === 0 && (
                        <SelectItem value="no-canteiros" disabled>Nenhum canteiro encontrado.</SelectItem>
                      )}
                      {canteirosDb.map((cant) => (
                        <SelectItem key={cant.id} value={cant.id.toString()}>
                          {cant.responsavel} ({cant.codigo}) (CEP: {cant.cep})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Button
                  onClick={handleAddWaypoint}
                  disabled={!selectedPointType || !selectedOriginDestId}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white" 
                >
                  Adicionar Ponto
                </Button>
              </CardContent>
            </Card>

            {/* Card: Pontos Adicionados à Rota */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <span>Pontos na Rota ({waypoints.length})</span>
                </CardTitle>
                <p className="text-sm text-gray-500">Arraste para reordenar (futuro)</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {waypoints.length === 0 ? (
                  <p className="text-sm text-gray-600">Nenhum ponto adicionado.</p>
                ) : (
                  waypoints.map((point, index) => (
                    <div key={`${point.id}-${point.type}`} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      {/* Cor do marcador baseada no tipo */}
                      <span className={`h-3 w-3 rounded-full ${point.type === 'alojamento' ? 'bg-blue-600' : point.type === 'canteiro' ? 'bg-red-600' : 'bg-gray-600'}`}></span>
                      <div className="flex-1 text-sm text-gray-800">
                        {index + 1}. {point.name}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveWaypoint(point.id, point.type, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUpDown className="h-3 w-3 rotate-90 transform" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveWaypoint(point.id, point.type, "down")}
                          disabled={index === waypoints.length - 1}
                        >
                          <ArrowUpDown className="h-3 w-3 -rotate-90 transform" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => removeWaypointAndMarker(point.id, point.type)}>
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
            
            {/* CARD: Seleção de Ordem de Serviço da Rota */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <ClipboardListIcon className="h-5 w-5 text-gray-600" /> {/* Ícone ClipboardListIcon */}
                  <span>Atribuir Ordem de Serviço</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={(value: string) => {
                  setSelectedOrdemServicoId(value);
                  const os = ordensServico.find(o => o.id.toString() === value);
                  setSelectedOrdemServicoData(os || null);
                }} value={selectedOrdemServicoId}>
                  <SelectTrigger className="flex items-center justify-between block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 py-2 text-gray-900">
                    <SelectValue placeholder="Selecione a Ordem de Serviço" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 text-gray-900 shadow-lg rounded-md border border-gray-200">
                      {loadingOrdensServico && <SelectItem value="loading" disabled>Carregando OS...</SelectItem>}
                      {errorOrdensServico && <SelectItem value="error" disabled className="text-red-500">{errorOrdensServico}</SelectItem>}
                      {!loadingOrdensServico && !errorOrdensServico && ordensServico.length === 0 && (
                        <SelectItem value="no-os" disabled>Nenhuma Ordem de Serviço encontrada.</SelectItem>
                      )}
                      {ordensServico.map((os) => (
                        <SelectItem key={os.id} value={os.id.toString()}>
                          OS {os.id} - {os.servico_funcao}
                          {os.canteiro_responsavel && ` (Canteiro: ${os.canteiro_responsavel})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                </Select>
                {selectedOrdemServicoData && (
                  <p className="text-sm text-gray-600 mt-2">
                    OS selecionada: {selectedOrdemServicoData.id} - {selectedOrdemServicoData.servico_funcao}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* NOVO CARD: Seleção de Veículo para a Rota */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Truck className="h-5 w-5 text-gray-600" />
                  <span>Atribuir Veículo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={(value: string) => {
                  setSelectedVeiculoId(value);
                  const veic = veiculos.find(v => v.id.toString() === value);
                  setSelectedVeiculoData(veic || null);
                }} value={selectedVeiculoId}>
                  <SelectTrigger className="flex items-center justify-between block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 py-2 text-gray-900">
                    <SelectValue placeholder="Selecione um veículo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 text-gray-900 shadow-lg rounded-md border border-gray-200">
                      {loadingVeiculos && <SelectItem value="loading" disabled>Carregando veículos...</SelectItem>}
                      {errorVeiculos && <SelectItem value="error" disabled className="text-red-500">{errorVeiculos}</SelectItem>}
                      {!loadingVeiculos && !errorVeiculos && veiculos.length === 0 && (
                        <SelectItem value="no-veiculos" disabled>Nenhum veículo encontrado.</SelectItem>
                      )}
                      {veiculos.map((veic) => (
                        <SelectItem key={veic.id} value={veic.id.toString()}>
                          {veic.placa} ({veic.tipo_veiculo} - Frota: {veic.frota})
                        </SelectItem>
                      ))}
                    </SelectContent>
                </Select>
                {selectedVeiculoData && (
                  <p className="text-sm text-gray-600 mt-2">
                    Veículo selecionado: {selectedVeiculoData.placa} ({selectedVeiculoData.tipo_veiculo})
                  </p>
                )}
              </CardContent>
            </Card>


            {/* Botão Gerar Rota Principal */}
            <Button
              onClick={generateMainRoute}
              disabled={waypoints.length < 2}
              className="w-full text-lg font-semibold py-3 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Gerar Rota Principal
            </Button>
          </div>

          {/* Seção do Mapa */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <div ref={mapContainer} className="w-full h-full rounded-lg" />
              </CardContent>
            </Card>
            {/* ✅ Cards de Estatísticas e Totais - MOVIDOS PARA CÁ, FORA DA SIDEBAR */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"> 
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-500">Rotas Geradas</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {totalDistanceKm.toFixed(2)} km
                  </div>
                  <div className="text-sm text-gray-500">Quilometragem Total</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {totalDurationMinutes.toFixed(0)} min
                  </div>
                  <div className="text-sm text-gray-500">Tempo Total Estimado</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {waypoints.length}
                  </div>
                  <div className="text-sm text-gray-500">Pontos na Rota</div>
                </CardContent>
              </Card>
            </div>
            {/* FIM DA SEÇÃO DE ESTATÍSTICAS AJUSTADA */}
          </div>
        </div>
      </div>
    </div>
  )
}