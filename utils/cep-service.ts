/**
 * Formata um CEP adicionando hífen
 * @param value CEP sem formatação ou parcialmente formatado
 * @returns CEP formatado (00000-000)
 */
export function formatarCEP(value: string): string {
    const cepNumeros = value.replace(/\D/g, "")
    if (cepNumeros.length <= 5) return cepNumeros
    return `${cepNumeros.slice(0, 5)}-${cepNumeros.slice(5, 8)}`
}

/**
 * Interface para o retorno da API ViaCEP
 */
interface ViaCEPResponse {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
    localidade: string
    uf: string
    ibge: string
    gia: string
    ddd: string
    siafi: string
    erro?: boolean
}

/**
 * Interface para o retorno padronizado da função de busca de CEP
 */
export interface EnderecoResponse {
    cep: string
    logradouro: string
    bairro: string
    cidade: string
    estado: string
}

/**
 * Busca endereço pelo CEP usando a API ViaCEP
 * @param cep CEP com ou sem formatação
 * @returns Objeto com os dados do endereço
 */
export async function buscarEnderecoPorCEP(cep: string): Promise<EnderecoResponse> {
    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, "")

    if (cepLimpo.length !== 8) {
        throw new Error("CEP inválido")
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)

        if (!response.ok) {
            throw new Error("Erro ao buscar CEP")
        }

        const data: ViaCEPResponse = await response.json()

        if (data.erro) {
            throw new Error("CEP não encontrado")
        }

        return {
            cep: data.cep,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
        }
    } catch (error) {
        console.error("Erro ao buscar CEP:", error)
        throw error
    }
}