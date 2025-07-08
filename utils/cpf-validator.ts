/**
 * Verifica se um CPF é válido
 * @param cpf CPF com ou sem formatação
 * @returns true se o CPF for válido, false caso contrário
 */
export function validarCPF(cpf: string): boolean {
    // Remove caracteres não numéricos
    const cpfLimpo = cpf.replace(/\D/g, "")

    // Verifica se tem 11 dígitos
    if (cpfLimpo.length !== 11) {
        return false
    }

    // Verifica se todos os dígitos são iguais (CPF inválido, mas com formato correto)
    if (/^(\d)\1{10}$/.test(cpfLimpo)) {
        return false
    }

    // Validação do primeiro dígito verificador
    let soma = 0
    for (let i = 0; i < 9; i++) {
        soma += Number.parseInt(cpfLimpo.charAt(i)) * (10 - i)
    }

    let resto = soma % 11
    const digitoVerificador1 = resto < 2 ? 0 : 11 - resto

    if (digitoVerificador1 !== Number.parseInt(cpfLimpo.charAt(9))) {
        return false
    }

    // Validação do segundo dígito verificador
    soma = 0
    for (let i = 0; i < 10; i++) {
        soma += Number.parseInt(cpfLimpo.charAt(i)) * (11 - i)
    }

    resto = soma % 11
    const digitoVerificador2 = resto < 2 ? 0 : 11 - resto

    return digitoVerificador2 === Number.parseInt(cpfLimpo.charAt(10))
}

/**
 * Formata um CPF adicionando pontos e hífen
 * @param value CPF sem formatação ou parcialmente formatado
 * @returns CPF formatado (XXX.XXX.XXX-XX)
 */
export function formatarCPF(value: string): string {
    const cpfNumeros = value.replace(/\D/g, "")
    if (cpfNumeros.length <= 3) return cpfNumeros
    if (cpfNumeros.length <= 6) return `${cpfNumeros.slice(0, 3)}.${cpfNumeros.slice(3)}`
    if (cpfNumeros.length <= 9) return `${cpfNumeros.slice(0, 3)}.${cpfNumeros.slice(3, 6)}.${cpfNumeros.slice(6)}`
    return `${cpfNumeros.slice(0, 3)}.${cpfNumeros.slice(3, 6)}.${cpfNumeros.slice(6, 9)}-${cpfNumeros.slice(9, 11)}`
}