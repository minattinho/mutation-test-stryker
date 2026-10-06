const TextoUtils = require("../src/textoUtils");

describe("textoUtils", () => {
  test("deve inverter um texto", () => {
    // Arrange
    const util = new TextoUtils();

    // Act
    const invertido = util.inverter("abc");
    const vazio = util.inverter("");

    // Assert
    expect(invertido).toBe("cba");
    expect(vazio).toBe("");
  });

  test("deve identificar palindromos ignorando espacos e caixa", () => {
    // Arrange
    const util = new TextoUtils();

    // Act
    const simples = util.ehPalindromo("arara");
    const comEspacos = util.ehPalindromo("Ame a ema");
    const naoPalindromo = util.ehPalindromo("javascript");

    // Assert
    expect(simples).toBe(true);
    expect(comEspacos).toBe(true);
    expect(naoPalindromo).toBe(false);
  });

  test("deve capitalizar cada palavra do texto", () => {
    // Arrange
    const util = new TextoUtils();

    // Act
    const capitalizado = util.capitalizar("maria DA silva");
    const comEspacoDuplo = util.capitalizar("ola  mundo");

    // Assert
    expect(capitalizado).toBe("Maria Da Silva");
    expect(comEspacoDuplo).toBe("Ola  Mundo");
  });

  test("deve contar as ocorrencias de uma substring", () => {
    // Arrange
    const util = new TextoUtils();

    // Act
    const ocorrencias = util.contarOcorrencias("banana", "na");
    const semOcorrencia = util.contarOcorrencias("banana", "z");
    const alvoVazio = util.contarOcorrencias("banana", "");

    // Assert
    expect(ocorrencias).toBe(2);
    expect(semOcorrencia).toBe(0);
    expect(alvoVazio).toBe(0);
  });

  test("deve remover espacos extras do texto", () => {
    // Arrange
    const util = new TextoUtils();

    // Act
    const limpo = util.removerEspacosExtras("  ola    mundo  ");

    // Assert
    expect(limpo).toBe("ola mundo");
  });

  test("deve converter o texto para slug", () => {
    // Arrange
    const util = new TextoUtils();

    // Act
    const slug = util.paraSlug("Olá Mundo!");
    const comAcentosEHifen = util.paraSlug("  Ação de Teste - 2024 ");

    // Assert
    expect(slug).toBe("ola-mundo");
    expect(comAcentosEHifen).toBe("acao-de-teste---2024");
  });

  test("deve truncar o texto respeitando o tamanho maximo", () => {
    // Arrange
    const util = new TextoUtils();

    // Act
    const truncado = util.truncar("javascript", 4);
    const menorQueLimite = util.truncar("abc", 10);
    const noLimite = util.truncar("abc", 3);
    const acaoNegativa = () => util.truncar("abc", -1);

    // Assert
    expect(truncado).toBe("java...");
    expect(menorQueLimite).toBe("abc");
    expect(noLimite).toBe("abc");
    expect(acaoNegativa).toThrow("O tamanho não pode ser negativo");
  });

  test("deve contar as palavras do texto", () => {
    // Arrange
    const util = new TextoUtils();

    // Act
    const palavras = util.contarPalavras("  um   dois tres ");
    const semPalavras = util.contarPalavras("   ");

    // Assert
    expect(palavras).toBe(3);
    expect(semPalavras).toBe(0);
  });

  test("deve verificar se o texto possui somente letras", () => {
    // Arrange
    const util = new TextoUtils();

    // Act
    const somenteLetras = util.somenteLetras("Ação");
    const comNumero = util.somenteLetras("abc1");
    const comEspaco = util.somenteLetras("ab c");

    // Assert
    expect(somenteLetras).toBe(true);
    expect(comNumero).toBe(false);
    expect(comEspaco).toBe(false);
  });

  test("deve substituir todas as ocorrencias de uma substring", () => {
    // Arrange
    const util = new TextoUtils();

    // Act
    const substituido = util.substituirTudo("banana", "na", "NA");
    const acaoAlvoVazio = () => util.substituirTudo("banana", "", "x");

    // Assert
    expect(substituido).toBe("baNANA");
    expect(acaoAlvoVazio).toThrow("O alvo não pode ser vazio");
  });

  // ---------------------------------------------------------------------------
  // Testes adicionados para matar mutantes sobreviventes do Stryker
  // ---------------------------------------------------------------------------

  test("deve gerar slug com um unico hifen entre palavras separadas por varios espacos", () => {
    // Arrange
    const util = new TextoUtils();

    // Act
    const slug = util.paraSlug("Olá   Mundo   Novo");

    // Assert
    expect(slug).toBe("ola-mundo-novo");
  });

  test("deve truncar para apenas reticencias quando o tamanho for zero", () => {
    // Arrange
    const util = new TextoUtils();

    // Act
    const truncado = util.truncar("abc", 0);

    // Assert
    expect(truncado).toBe("...");
  });

  test("deve contar palavras com espacos nas pontas e varios espacos entre elas", () => {
    // Arrange
    const util = new TextoUtils();

    // Act
    const comEspacosNasPontas = util.contarPalavras("  um");
    const comVariosEspacos = util.contarPalavras("um   dois");
    const textoVazio = util.contarPalavras("");

    // Assert
    expect(comEspacosNasPontas).toBe(1);
    expect(comVariosEspacos).toBe(2);
    expect(textoVazio).toBe(0);
  });
});
