const Utilitarios = require("../src/utilitarios");

describe("utilitarios", () => {
  test("deve executar operacoes com strings", () => {
    // Arrange
    const util = new Utilitarios();

    // Act
    const invertida = util.inverterString("abc");
    const contagem = util.contarCaracteres("abcd");
    const maiusculas = util.paraMaiusculas("abc");
    const minusculas = util.paraMinusculas("ABC");
    const primeiraMaiuscula = util.primeiraLetraMaiuscula("maria");
    const semEspacos = util.removerEspacos("  oi  ");
    const repetido = util.repetirTexto("ha", 3);
    const palavras = util.contarPalavras("  um   dois tres ");
    const palindromo = util.ehPalindromo("Ame a ema");

    // Assert
    expect(invertida).toBe("cba");
    expect(contagem).toBe(4);
    expect(maiusculas).toBe("ABC");
    expect(minusculas).toBe("abc");
    expect(primeiraMaiuscula).toBe("Maria");
    expect(semEspacos).toBe("oi");
    expect(repetido).toBe("hahaha");
    expect(palavras).toBe(3);
    expect(palindromo).toBe(true);
  });

  test("deve executar operacoes matematicas e validacoes", () => {
    // Arrange
    const util = new Utilitarios();

    // Act
    const soma = util.somar(10, 5);
    const subtracao = util.subtrair(10, 5);
    const multiplicacao = util.multiplicar(10, 5);
    const divisao = util.dividir(10, 5);
    const acaoDivisaoZero = () => util.dividir(10, 0);
    const par = util.ehPar(4);
    const impar = util.ehPar(5);
    const numeroValido = util.ehNumero(10);
    const numeroInvalido = util.ehNumero(NaN);

    // Assert
    expect(soma).toBe(15);
    expect(subtracao).toBe(5);
    expect(multiplicacao).toBe(50);
    expect(divisao).toBe(2);
    expect(acaoDivisaoZero).toThrow("Divisão por zero");
    expect(par).toBe(true);
    expect(impar).toBe(false);
    expect(numeroValido).toBe(true);
    expect(numeroInvalido).toBe(false);
  });

  test("deve executar operacoes de arrays e objetos", () => {
    // Arrange
    const util = new Utilitarios();
    const arr = [3, 1, 2, 2];

    // Act
    const primeiro = util.primeiroElemento(arr);
    const ultimo = util.ultimoElemento(arr);
    const tamanho = util.tamanhoArray(arr);
    const ordenado = util.ordenarArray(arr);
    const invertido = util.inverterArray(arr);
    const juntaPadrao = util.juntarArray(["a", "b"]);
    const juntaCustom = util.juntarArray(["a", "b"], "|");
    const media = util.mediaArray([2, 4, 6]);
    const mediaVazia = util.mediaArray([]);
    const semDuplicados = util.removerDuplicados(arr);
    const mesclado = util.mesclarObjetos({ a: 1, b: 2 }, { b: 3, c: 4 });

    // Assert
    expect(primeiro).toBe(3);
    expect(ultimo).toBe(2);
    expect(tamanho).toBe(4);
    expect(ordenado).toEqual([1, 2, 2, 3]);
    expect(invertido).toEqual([2, 2, 1, 3]);
    expect(juntaPadrao).toBe("a,b");
    expect(juntaCustom).toBe("a|b");
    expect(media).toBe(4);
    expect(mediaVazia).toBe(0);
    expect(semDuplicados).toEqual([3, 1, 2]);
    expect(mesclado).toEqual({ a: 1, b: 3, c: 4 });
  });

  test("deve gerar numero aleatorio dentro do limite", () => {
    // Arrange
    const util = new Utilitarios();

    // Act
    const numero = util.gerarNumeroAleatorio(10);

    // Assert
    expect(numero).toBeGreaterThanOrEqual(0);
    expect(numero).toBeLessThan(10);
  });

  // ---------------------------------------------------------------------------
  // Testes adicionados para matar mutantes sobreviventes do Stryker
  // ---------------------------------------------------------------------------

  test("deve escalar o numero aleatorio pelo maximo informado", () => {
    // Arrange
    const util = new Utilitarios();
    const random = jest.spyOn(Math, "random").mockReturnValue(0.75);

    // Act
    const numero = util.gerarNumeroAleatorio(10);
    const numeroPadrao = util.gerarNumeroAleatorio();

    // Assert
    expect(numero).toBe(7);
    expect(numeroPadrao).toBe(75);
    random.mockRestore();
  });

  test("nao deve considerar numero uma string numerica", () => {
    // Arrange
    const util = new Utilitarios();

    // Act
    const stringNumerica = util.ehNumero("10");

    // Assert
    expect(stringNumerica).toBe(false);
  });

  test("deve identificar textos que nao sao palindromos", () => {
    // Arrange
    const util = new Utilitarios();

    // Act
    const naoPalindromo = util.ehPalindromo("Socorram me");
    const palindromoComPontuacao = util.ehPalindromo("A_b-A!");

    // Assert
    expect(naoPalindromo).toBe(false);
    expect(palindromoComPontuacao).toBe(true);
  });
});
