const Pescaria = require("../src/pescaria");

describe("pescaria", () => {
  test("deve iniciar a pescaria com os valores padrao", () => {
    // Arrange
    const pescaria = new Pescaria("Joao");

    // Act
    const pescador = pescaria.pescador;
    const isca = pescaria.isca;
    const lancamentos = pescaria.lancamentos;
    const peixes = pescaria.peixes;

    // Assert
    expect(pescador).toBe("Joao");
    expect(isca).toBe("minhoca");
    expect(lancamentos).toBe(0);
    expect(peixes).toEqual([]);
  });

  test("deve lancar a linha e trocar a isca", () => {
    // Arrange
    const pescaria = new Pescaria("Joao");

    // Act
    pescaria.lancarLinha();
    pescaria.lancarLinha();
    pescaria.trocarIsca("camarao");

    // Assert
    expect(pescaria.lancamentos).toBe(2);
    expect(pescaria.isca).toBe("camarao");
  });

  test("deve fisgar peixes e informar os dados de cada um", () => {
    // Arrange
    const pescaria = new Pescaria("Joao");

    // Act
    pescaria.fisgar("tilapia", 2);
    pescaria.fisgar("dourado", 5);
    const total = pescaria.totalDePeixes();
    const buscaExistente = pescaria.buscar("dourado");
    const buscaInexistente = pescaria.buscar("tucunare");
    const pegouTilapia = pescaria.pegou("tilapia");
    const pegouTucunare = pescaria.pegou("tucunare");
    const peso = pescaria.pesoDe("tilapia");

    // Assert
    expect(total).toBe(2);
    expect(buscaExistente).toEqual({ nome: "dourado", peso: 5 });
    expect(buscaInexistente).toBeUndefined();
    expect(pegouTilapia).toBe(true);
    expect(pegouTucunare).toBe(false);
    expect(peso).toBe(2);
  });

  test("deve falhar ao pedir o peso de um peixe que nao foi fisgado", () => {
    // Arrange
    const pescaria = new Pescaria("Joao");
    pescaria.fisgar("tilapia", 2);

    // Act
    const acao = () => pescaria.pesoDe("tucunare");

    // Assert
    expect(acao).toThrow();
  });

  test("deve soltar um peixe especifico e depois todos os peixes", () => {
    // Arrange
    const pescaria = new Pescaria("Joao");
    pescaria.fisgar("tilapia", 2);
    pescaria.fisgar("dourado", 5);

    // Act
    pescaria.soltar("tilapia");
    const aposSoltarUm = pescaria.nomes();
    pescaria.soltarTodos();
    const vazio = pescaria.voltouVazio();

    // Assert
    expect(aposSoltarUm).toEqual(["dourado"]);
    expect(vazio).toBe(true);
  });

  test("deve manter os peixes quando soltar um nome inexistente", () => {
    // Arrange
    const pescaria = new Pescaria("Joao");
    pescaria.fisgar("tilapia", 2);

    // Act
    pescaria.soltar("tucunare");

    // Assert
    expect(pescaria.totalDePeixes()).toBe(1);
    expect(pescaria.voltouVazio()).toBe(false);
  });

  test("deve calcular peso total, peso medio, maior e menor peixe", () => {
    // Arrange
    const pescaria = new Pescaria("Joao");
    pescaria.fisgar("tilapia", 2);
    pescaria.fisgar("dourado", 6);
    pescaria.fisgar("pintado", 4);

    // Act
    const pesoTotal = pescaria.pesoTotal();
    const pesoMedio = pescaria.pesoMedio();
    const maior = pescaria.maiorPeixe();
    const menor = pescaria.menorPeixe();

    // Assert
    expect(pesoTotal).toBe(12);
    expect(pesoMedio).toBe(4);
    expect(maior).toEqual({ nome: "dourado", peso: 6 });
    expect(menor).toEqual({ nome: "tilapia", peso: 2 });
  });

  test("deve encontrar maior e menor peixe quando eles vem no fim da lista", () => {
    // Arrange
    const pescaria = new Pescaria("Joao");
    pescaria.fisgar("pintado", 4);
    pescaria.fisgar("lambari", 1);
    pescaria.fisgar("dourado", 9);

    // Act
    const maior = pescaria.maiorPeixe();
    const menor = pescaria.menorPeixe();

    // Assert
    expect(maior).toEqual({ nome: "dourado", peso: 9 });
    expect(menor).toEqual({ nome: "lambari", peso: 1 });
  });

  test("deve filtrar peixes acima e abaixo de um peso", () => {
    // Arrange
    const pescaria = new Pescaria("Joao");
    pescaria.fisgar("tilapia", 2);
    pescaria.fisgar("dourado", 6);
    pescaria.fisgar("pintado", 4);

    // Act
    const acimaDeQuatro = pescaria.acimaDe(4);
    const abaixoDeQuatro = pescaria.abaixoDe(4);

    // Assert
    expect(acimaDeQuatro).toEqual([{ nome: "dourado", peso: 6 }]);
    expect(abaixoDeQuatro).toEqual([{ nome: "tilapia", peso: 2 }]);
  });

  test("deve ordenar os peixes por nome e por peso", () => {
    // Arrange
    const pescaria = new Pescaria("Joao");
    pescaria.fisgar("tilapia", 2);
    pescaria.fisgar("dourado", 6);
    pescaria.fisgar("pintado", 4);

    // Act
    const porNome = pescaria.ordenarPorNome();
    const porPeso = pescaria.ordenarPorPeso();
    const originalPreservado = pescaria.nomes();

    // Assert
    expect(porNome).toEqual(["dourado", "pintado", "tilapia"]);
    expect(porPeso).toEqual([
      { nome: "tilapia", peso: 2 },
      { nome: "pintado", peso: 4 },
      { nome: "dourado", peso: 6 },
    ]);
    expect(originalPreservado).toEqual(["tilapia", "dourado", "pintado"]);
  });

  test("deve calcular o aproveitamento dos lancamentos", () => {
    // Arrange
    const pescaria = new Pescaria("Joao");
    pescaria.lancarLinha();
    pescaria.lancarLinha();
    pescaria.lancarLinha();
    pescaria.lancarLinha();
    pescaria.fisgar("tilapia", 2);

    // Act
    const aproveitamento = pescaria.aproveitamento();

    // Assert
    expect(aproveitamento).toBe(25);
  });

  test("deve informar quando a cota de peixes foi ultrapassada", () => {
    // Arrange
    const pescaria = new Pescaria("Joao");
    pescaria.fisgar("tilapia", 2);
    pescaria.fisgar("dourado", 6);

    // Act
    const passou = pescaria.passouDaCota(1);
    const naoPassou = pescaria.passouDaCota(2);

    // Assert
    expect(passou).toBe(true);
    expect(naoPassou).toBe(false);
  });

  test("deve gerar o resumo da pescaria", () => {
    // Arrange
    const pescaria = new Pescaria("Joao");
    pescaria.fisgar("tilapia", 2);
    pescaria.fisgar("dourado", 6);

    // Act
    const resumo = pescaria.resumo();

    // Assert
    expect(resumo).toBe("Joao pescou 2 peixes (8 kg)");
  });

  test("deve tratar a pescaria sem nenhum peixe", () => {
    // Arrange
    const pescaria = new Pescaria("Joao");

    // Act
    const pesoTotal = pescaria.pesoTotal();
    const pesoMedio = pescaria.pesoMedio();
    const vazio = pescaria.voltouVazio();
    const acaoMaior = () => pescaria.maiorPeixe();
    const acaoMenor = () => pescaria.menorPeixe();

    // Assert
    expect(pesoTotal).toBe(0);
    expect(pesoMedio).toBeNaN();
    expect(vazio).toBe(true);
    expect(acaoMaior).toThrow("Nenhum peixe foi fisgado");
    expect(acaoMenor).toThrow("Nenhum peixe foi fisgado");
  });

  // ---------------------------------------------------------------------------
  // Testes adicionados para matar mutantes sobreviventes do Stryker
  // ---------------------------------------------------------------------------

  test("deve manter o primeiro peixe fisgado em caso de empate de peso", () => {
    // Arrange
    const pescaria = new Pescaria("Joao");
    pescaria.fisgar("tilapia", 4);
    pescaria.fisgar("pacu", 4);

    // Act
    const maior = pescaria.maiorPeixe();
    const menor = pescaria.menorPeixe();

    // Assert
    expect(maior).toEqual({ nome: "tilapia", peso: 4 });
    expect(menor).toEqual({ nome: "tilapia", peso: 4 });
  });
});
