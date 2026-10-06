const isAnagram = (str1, str2) => {
  return formatStr(str1) === formatStr(str2);
};

function formatStr(str) {
  const somenteCaracteres = str.replace(/[^\w]/g, "");

  // Mutante equivalente: toUpperCase também deixa a caixa uniforme, e os dois
  // lados da comparação passam pela mesma transformação.
  // Stryker disable next-line MethodExpression: mutante equivalente (ver comentário acima)
  const normalizado = somenteCaracteres.toLowerCase();

  const letrasOrdenadas = normalizado.split("").sort();

  // Mutante equivalente: qualquer separador no join gera a mesma comparação,
  // pois as duas strings são unidas com o mesmo separador.
  // Stryker disable next-line StringLiteral: mutante equivalente (ver comentário acima)
  return letrasOrdenadas.join("");
}

module.exports = {
  isAnagram,
};
