import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { createCSVFile } from "./createCSVFile";

export async function getFile(
  pathDate: string,
  fileName: string,
  filePart: string,
  initialNumber: number,
  logger,
  pathToNesca: string,
  countryCode: string,
  currentDate: string,
  pathToOutputFile
) {

  let pathToFile;

  if (fileName === 'default') {
    pathToFile = path.resolve(
      `${pathToNesca}/result_files-${pathDate}`,
      `hikkafile_${pathDate}_part_${filePart}.csv`
    );
  } else {
    pathToFile = path.resolve(
      `${pathToNesca}/result_files-${pathDate}`,
      `${fileName}.csv`
    );
  }

  console.log("path", pathToFile);

  const rowArr = [];

  initialNumber = +initialNumber || 1;

  fs.createReadStream(pathToFile)
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", function (row) {
      try {
        const ip = row[0];
        const port = row[3];
        const login = row[5];
        const password = row[6];

        if (password.length === 0) {
          return;
        }
        rowArr.push([
          `${countryCode}_${currentDate}_${row[0]}`,
          "0",
          ip,
          port,
          "Invalid",
          login,
          password,
          "0",
          "1",
          "Invalid",
          "Invalid",
          "0",
        ]);
        initialNumber = +initialNumber + 1;
      } catch (error) {
        console.error("Error parsing row:", error);
      }
    })
    .on("end", function () {
      logger.info("Анализ файла окончен. Начинаю работу...");
      console.log("rows", rowArr);
      // createHTMLFile(rowArr, logger, pathToOutputFile);
      createCSVFile(rowArr, logger, pathToOutputFile);
      initialNumber = 0;
    })
    .on("error", function (error) {
      logger.error("from getFile", error.message);
    });
}
