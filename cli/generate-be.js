const { generateTemplateFiles } = require("generate-template-files-v2");
const { importRouter } = require("./helpers/importRouter");
const { extractParamString } = require("./helpers/extractParamString");
const { extractColumnSchema } = require("./helpers/extractColumnSchema");

const pathBE = "../nestjs-mongodb-starter/";
const generateBeFn = (dynamicReplacers) => {
  generateTemplateFiles([
    {
      option: "Create new module backend",
      defaultCase: "(CamelCase)",
      entry: {
        folderPath: `${pathBE}cli/templates/module/`,
      },
      dynamicReplacers: [
        ...dynamicReplacers,

        {
          slot: "__params_be__",
          newSlot: ({ __path_api__ }) => {
            const arrParam = extractParamString(__path_api__);
            if (arrParam.length === 0) return "";
            return (
              arrParam
                ?.map((e) => {
                  return `@Param('${e}', ParseObjectIdPipe) ${e}: Types.ObjectId`;
                })
                .join(", ") + ","
            );
          },
        },
        {
          slot: "__path_api_be__",
          newSlot: ({ __path_api__ }) => {
            return __path_api__?.replaceAll("${", ":")?.replaceAll("}", "");
          },
        },
        {
          slot: "__column-table-be__",
          newSlot: ({ __schemaTable__ }) => {
            const arrColumn = extractColumnSchema(__schemaTable__);
            if (!arrColumn) return "";

            return arrColumn
              ?.map((e) => {
                return `
                  \n
                  @Prop()
                  ${e?.key}: ${
                  // e?.searchType ||
                  "string"
                };
                  \n
              `;
              })
              .join("\n");
          },
        },
        {
          slot: "__search-param-be__",
          newSlot: ({ __schemaTable__ }) => {
            const arrColumn = extractColumnSchema(__schemaTable__);
            if (!arrColumn) return "";
            const columnSearchAble = arrColumn?.filter((e) => !!e?.searchType);
            if (columnSearchAble?.length === 0) return "";
            if (!arrColumn) return "";

            return columnSearchAble
              ?.map((e) => {
                return `
                  \n
                  ...(query?.${e?.key} && {
                    ${e?.key}: { $regex: query?.${e?.key}?.normalize(), $options: 'i' },
                  }),
                  \n
              `;
              })
              .join("\n");
          },
        },
      ],
      // stringReplacers: [
      //   {
      //     question: "Module __name__",
      //     slot: "__name__",
      //   },
      //   {
      //     slot: "__schemaTable__",
      //     question:
      //       "schema of table ( ex : Tên:name:text , Trạng thái:status:select) __schemaTable__",
      //   },
      // ],

      output: {
        path: `${pathBE}src/__name__(lowerCase)s`,
        pathAndFileNameDefaultCase: "(kebabCase)",
        overwrite: true,
      },
    },
  ]);
};
module.exports = {
  generateBeFn,
};
