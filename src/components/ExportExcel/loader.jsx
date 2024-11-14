import { Button } from "antd";
import React from "react";
import { Excel } from "antd-table-saveas-excel";
import dayjs from "dayjs";
import ExcelJS from "exceljs";

import { ExportOutlined } from "@ant-design/icons";
const linkStyle = {
  underline: true,
  color: { argb: "FF0000FF" },
};
const ExportExcelReport = ({
  type = "report",
  columns,
  dataSource,
  headerRows = [1],
}) => {
  const finalColumn = columns
    ?.filter((e) => e?.key !== "action")
    // ?.filter((e) => e?.dataIndex !== "image1")
    // ?.filter((e) => e?.dataIndex !== "giftImage")
    ?.filter((e) => !e?.noExcel);
  // ?.filter((e) => e?.dataIndex?.includes("image"))
  // ?.filter((e) => !e?.noExport);

  const exportToExcel = async () => {
    const name = `${type}-${dayjs().format("DD-MM-YYYY HH:mm:ss")}`;
    const excel = new Excel();
    const ws = excel
      .addSheet("sheet-1")
      .setTHeadStyle({
        background: "32a852",
        color: "FFFFFF",
        v: "center",
        fontName: "Calibri",
        fontSize: 9,
        height: 10,
        bold: true,
      })
      .setTBodyStyle({
        v: "center",
        fontName: "Calibri",
        fontSize: 9,
        height: 10,
        bold: true,
      })

      .addColumns(finalColumn)
      .addDataSource(dataSource, {
        str2Percent: false,
        str2num: false,
      });

    // const rs = ws.saveAs(`${name}.xlsx`);

    const wb = new ExcelJS.Workbook();
    const reader = new FileReader();
    ws.file.saveAs("blob").then((file) => {
      reader.readAsArrayBuffer(file);
    });
    const readFilePromise = () => {
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const buffer = reader.result;

          wb.xlsx.load(buffer).then((workbook) => {
            resolve(workbook);
          });
        };
      });
    };
    const newWorkBook = await readFilePromise();

    newWorkBook.eachSheet((sheet) => {
      sheet.eachRow((row, i) => {
        if (!headerRows.includes(i)) {
          row.eachCell((cell, i2) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFFF" },
            };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            const isLink = cell.value?.toString()?.includes("https://");
            if (isLink) {
              cell.value = {
                hyperlink: cell.value,
                text: "Xem",
              };
              cell.style = JSON.parse(JSON.stringify(cell.style)); //very bad way to clone anythink, but works.

              cell.font = linkStyle;

              console.log({ isLink: isLink, cell: cell.value });
            }
          });
        }
      });
    });
    // newWorkBook.eachSheet((sheet, id) => {
    //   sheet.eachRow((row, rowIndex) => {
    //     row.eachCell((cell) => {
    //       const isLink = cell.value?.toString()?.includes("https://");
    //       if (isLink) {
    //         cell.value = {
    //           hyperlink: cell.value,
    //           text: "Xem",
    //         };
    //         // cell.font = linkStyle;
    //         console.log({ isLink: isLink, cell: cell.value });
    //       }
    //     });
    //   });
    // });

    newWorkBook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${name}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };
  return (
    <Button icon={<ExportOutlined />} onClick={exportToExcel} type="primary">
      Xuất
    </Button>
  );
};

export default ExportExcelReport;
