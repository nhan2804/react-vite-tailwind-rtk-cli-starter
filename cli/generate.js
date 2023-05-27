const { generateTemplateFiles } = require("generate-template-files");
const { importRouter } = require("./helpers/importRouter");

generateTemplateFiles([
  {
    option: "Create new module",
    defaultCase: "(CamelCase)",
    entry: {
      folderPath: "./cli/templates/react/modules/",
    },
    stringReplacers: [
      {
        question: "Module __name__",
        slot: "__name__",
      },
      {
        question: "Add module to root routes?",
        slot: "isImportRoute",
      },
      { question: "API Path __path_api__", slot: "__path_api__" },
    ],
    output: {
      path: "./src/modules/__name__(lowerCase)s",
      pathAndFileNameDefaultCase: "(kebabCase)",
      overwrite: true,
    },
    onComplete: (results) => {
      if (results?.stringReplacers?.findIndex((e) => !!e?.slotValue) !== -1) {
        importRouter(results);
        console.log("Add route successfully!");
      }
    },
  },
]);
