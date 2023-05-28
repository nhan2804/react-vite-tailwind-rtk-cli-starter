const { generateTemplateFiles } = require("generate-template-files-v2");
const { importRouter } = require("./helpers/importRouter");
const { extractParamString } = require("./helpers/extractParamString");
const { extractColumnSchema } = require("./helpers/extractColumnSchema");
const { generateBeFn } = require("./generate-be");

// generateTemplateFilesCommandLine(items);
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
        slot: "__schemaTable__",
        question:
          "schema of table ( ex : Tên:name:text , Trạng thái:status:select) __schemaTable__",
      },
      {
        question:
          "API Path __path_api__ ex : tickets or project/${projectId}/tickets",
        slot: "__path_api__",
      },
      {
        question: "Add module to root routes?",
        slot: "isImportRoute",
      },
      {
        question: "Also generate backend (Y/n)?",
        slot: "pathBackend",
      },
    ],
    dynamicReplacers: [
      {
        slot: "__params__",
        newSlot: ({ __path_api__ }) => {
          const arrParam = extractParamString(__path_api__);
          if (arrParam.length === 0) return "";
          return arrParam.join(", ") + ",";
        },
      },
      {
        slot: "__column-table__",
        newSlot: ({ __schemaTable__ }) => {
          const arrColumn = extractColumnSchema(__schemaTable__);
          if (!arrColumn) return "";

          return (
            arrColumn
              ?.map((e) => {
                return `
            {
              title: "${e?.title}",
              dataIndex: "${e?.dataIndex}",
              key: "${e?.dataIndex}",
            }
            `;
              })
              .join(",") + ","
          );
        },
      },
      {
        slot: "__column-search-able__",
        newSlot: ({ __schemaTable__ }) => {
          const arrColumn = extractColumnSchema(__schemaTable__);
          if (!arrColumn) return "";
          const columnSearchAble = arrColumn?.filter((e) => !!e?.searchType);
          if (columnSearchAble?.length === 0) return "";

          return columnSearchAble
            ?.map((e) => {
              const mappingInput = {
                text: `<Input placeholder="${e?.title}" />`,
                select: `
                <Select allowClear placeholder="${e?.title}">
                  {[].map((e) => {
                    return (
                      <Select.Option value={e?.value}>{e?.label}</Select.Option>
                    );
                  })}
                </Select>
                `,
              };
              return mappingInput?.[e?.searchType]
                ? `<Form.Item name="${e?.key}">
                  ${mappingInput?.[e?.searchType]}
                  </Form.Item>`
                : "";
            })
            .join("\n");
        },
      },
      {
        slot: "__column-form__",
        newSlot: ({ __schemaTable__ }) => {
          const arrColumn = extractColumnSchema(__schemaTable__);
          if (!arrColumn) return "";

          return arrColumn
            ?.map((e) => {
              const mappingInput = {
                text: `<Input placeholder="${e?.title}" />`,
                select: `
                <Select allowClear placeholder="${e?.title}">
                  {[].map((e) => {
                    return (
                      <Select.Option value={e?.value}>{e?.label}</Select.Option>
                    );
                  })}
                </Select>
                `,
              };
              return mappingInput?.[e?.searchType]
                ? `<Form.Item name="${e?.key}">
                  ${mappingInput?.[e?.searchType]}
                  </Form.Item>`
                : "";
            })
            .join("\n");
        },
      },
    ],

    output: {
      path: "./src/modules/__name__(lowerCase)s",
      pathAndFileNameDefaultCase: "(kebabCase)",
      overwrite: true,
    },
    onComplete: (results) => {
      let stringReplacers = results?.stringReplacers?.map((e) => {
        return {
          ...e,
          slotValue: e?.slotValue?.toLowerCase(),
        };
      });
      if (
        stringReplacers?.findIndex(
          (e) =>
            e?.slot === "isImportRoute" &&
            (e?.slotValue === "yes" || e?.slotValue === "y")
        ) !== -1
      ) {
        importRouter(results);
      }
      if (
        stringReplacers?.findIndex(
          (e) =>
            e?.slot === "pathBackend" &&
            (e?.slotValue === "y" || e?.slotValue === "yes")
        ) !== -1
      ) {
        generateBeFn(stringReplacers);
      }
    },
  },
]);
