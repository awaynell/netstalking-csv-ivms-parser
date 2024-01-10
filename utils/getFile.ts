import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { createHTMLFile } from "./createHTMLFile";

export async function getFile(
  pathDate: string,
  fileName: string,
  initialNumber: number,
  logger,
  pathToNesca: string,
  countryCode: string,
  currentDate: string,
  pathToOutputFile
) {
  const pathToFile = path.resolve(
    `${pathToNesca}/result_files-${pathDate}`,
    `${fileName}.csv`
  );

  const rowArr = ["NAME", "IP", "LOGIN", "PASSWORD"];

  initialNumber = +initialNumber || 1;

  fs.createReadStream(pathToFile)
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", function (row) {
      rowArr.push(
        `${countryCode} ${currentDate} ${initialNumber}`,
        row[0],
        row[5],
        row[6]
      );
      initialNumber = +initialNumber + 1;
    })
    .on("end", function () {
      logger.info("Анализ файла окончен. Начинаю работу...");
      createHTMLFile(rowArr, logger, pathToOutputFile);
      initialNumber = 0;
    })
    .on("error", function (error) {
      logger.error(error.message);
    });
}
