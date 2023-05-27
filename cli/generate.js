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

        // customValueSlot: (val) => {
        //   return val;
        // },
      },
      { question: "API Path __path_api__", slot: "__path_api__" },
    ],
    output: {
      path: "./src/modules/__name__(lowerCase)s",
      pathAndFileNameDefaultCase: "(kebabCase)",
      overwrite: true,
    },
    onComplete: (results) => {
      importRouter(results);
    },
  },
]);
