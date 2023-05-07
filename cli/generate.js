const { generateTemplateFiles } = require("generate-template-files");
const filename = require("file-name");
const insertLine = require("insert-line");
const config = require("../package.json");
const fs = require("fs");
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
    dynamicReplacers: [
      {
        slot: "__name__",
        slotValue: "nnsnsnns",
      },
    ],
  },
]);
