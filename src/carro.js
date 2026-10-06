class Carro {
    constructor(marca, modelo, ano) {
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.kilometragem = 0;
    }

    dirigir(distancia) {
        // Antes: if (distancia > 0) { this.kilometragem += distancia; }
        // O Stryker apontou que trocar ">" por ">=" sobrevivia: somar 0 não
        // muda nada, então o limite do if era irrelevante (mutante equivalente).
        // Math.max expressa a regra diretamente: distância negativa conta como 0.
        this.kilometragem += Math.max(distancia, 0);
    }

    obterInfo() {
        return `${this.marca} ${this.modelo}, Ano: ${this.ano}, Quilometragem: ${this.kilometragem} km`;
    }
}

module.exports = Carro;
