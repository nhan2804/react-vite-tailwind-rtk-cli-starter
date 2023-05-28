const filename = require("file-name");
const insertLine = require("insert-line");
const fs = require("fs");
function importRouter(results, cb) {
  const pathRoute = `${results.output.path}/routes`?.replace("./src/", "@");
  const nameModule = results.output.path?.split("/")?.[3];

  const filePath = "./src/routes/index.js";
  const line1Content = `import ${nameModule}Routes from "${pathRoute}";`;
  const line2Content = `...${nameModule}Routes,`;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    const lines = data.split("\n");

    const lengthLineImport = lines.filter((e) => e?.includes("import"))?.length;
    let importIndex = lines?.findIndex((line) => line.includes("import"));
    if (importIndex === -1) {
      console.error('Line "import" not found.');
      return;
    }
    importIndex += lengthLineImport;

    const lengthLineArray = lines.filter((e) => e?.includes("..."))?.length;
    // Find the index in the "routes" array where "...managerRoutes," is located
    let routesArrayIndex = lines?.findIndex((line) => line.includes("..."));
    if (routesArrayIndex === -1) {
      console.error('Array index "..." not found.');
      return;
    }
    routesArrayIndex += lengthLineArray;
    // Insert the first line below "import managerRoutes"
    insertLine(filePath)
      .contentSync(line1Content)
      .at(importIndex + 1);

    insertLine(filePath)
      .contentSync(line2Content)
      // + 1+1 because importIndex inserted
      .at(routesArrayIndex + 1 + 1);
    if (cb) {
      console.log("Lines inserted successfully.");
      cb?.();
    }
  });

  // console.log(files);
  // const fullPaths = files
  //   .map((folderPath) => folderPath.replace("src/", "")) // remove 'src' from path
  //   .map((path) => `import ${filename(path)} from '${path}'`) // create import statement
  //   .join("\n"); // put all imports on there own line
  // console.log(fullPaths);
  // try {
  //   await insertLine("src/import-test.ts").append(fullPaths);
  // } catch (error) {
  //   console.log(``, error);
  // }
}
module.exports = {
  importRouter,
};
