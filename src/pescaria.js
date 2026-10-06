class Pescaria {
    constructor(pescador) {
        this.pescador = pescador;
        this.isca = 'minhoca';
        this.lancamentos = 0;
        this.peixes = [];
    }

    lancarLinha() {
        this.lancamentos += 1;
    }

    trocarIsca(isca) {
        this.isca = isca;
    }

    fisgar(nome, peso) {
        this.peixes.push({ nome, peso });
    }

    soltar(nome) {
        this.peixes = this.peixes.filter(p => p.nome !== nome);
    }

    soltarTodos() {
        this.peixes = [];
    }

    buscar(nome) {
        return this.peixes.find(p => p.nome === nome);
    }

    pegou(nome) {
        return this.peixes.some(p => p.nome === nome);
    }

    pesoDe(nome) {
        return this.buscar(nome).peso;
    }

    totalDePeixes() {
        return this.peixes.length;
    }

    pesoTotal() {
        return this.peixes.reduce((soma, p) => soma + p.peso, 0);
    }

    pesoMedio() {
        return this.pesoTotal() / this.totalDePeixes();
    }

    maiorPeixe() {
        if (this.voltouVazio()) {
            throw new Error('Nenhum peixe foi fisgado');
        }
        return this.peixes.reduce((maior, p) => (p.peso > maior.peso ? p : maior), this.peixes[0]);
    }

    menorPeixe() {
        if (this.voltouVazio()) {
            throw new Error('Nenhum peixe foi fisgado');
        }
        return this.peixes.reduce((menor, p) => (p.peso < menor.peso ? p : menor), this.peixes[0]);
    }

    voltouVazio() {
        return this.peixes.length === 0;
    }

    acimaDe(peso) {
        return this.peixes.filter(p => p.peso > peso);
    }

    abaixoDe(peso) {
        return this.peixes.filter(p => p.peso < peso);
    }

    nomes() {
        return this.peixes.map(p => p.nome);
    }

    ordenarPorNome() {
        return this.nomes().sort((a, b) => a.localeCompare(b));
    }

    ordenarPorPeso() {
        return [...this.peixes].sort((a, b) => a.peso - b.peso);
    }

    // quantos lancamentos deram peixe
    aproveitamento() {
        return (this.totalDePeixes() / this.lancamentos) * 100;
    }

    passouDaCota(limite) {
        return this.totalDePeixes() > limite;
    }

    resumo() {
        return `${this.pescador} pescou ${this.totalDePeixes()} peixes (${this.pesoTotal()} kg)`;
    }
}

module.exports = Pescaria;
