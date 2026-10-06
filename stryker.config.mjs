// @ts-check
/**
 * Configuração do Stryker Mutator.
 * Docs: https://stryker-mutator.io/docs/stryker-js/configuration
 *
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
const config = {
  packageManager: "npm",
  testRunner: "jest",
  // Analisa a cobertura por teste: cada mutante roda só os testes que passam por ele.
  coverageAnalysis: "perTest",

  // Arquivos que recebem mutações (o código de produção, nunca os testes).
  mutate: ["src/**/*.js"],

  jest: {
    projectType: "custom",
    // Lê a seção "jest" do package.json.
    configFile: "package.json",
    enableFindRelatedTests: true,
  },

  reporters: ["clear-text", "progress", "html", "json"],
  htmlReporter: { fileName: "reports/mutation/mutation.html" },
  jsonReporter: { fileName: "reports/mutation/mutation.json" },

  // high/low definem as cores do relatório; break faz o comando falhar (exit 1)
  // se o mutation score cair abaixo do valor — usado na CI como quality gate.
  thresholds: { high: 90, low: 80, break: 85 },

  timeoutMS: 10000,
  tempDirName: ".stryker-tmp",
  cleanTempDir: true,
};

export default config;
