import * as fs from "fs";
import { fileIsExist } from "./common";
const createCsvWriter = require("csv-writer").createArrayCsvWriter;

export async function createCSVFile(rows, logger, pathToOutputFile) {
  if (fileIsExist(pathToOutputFile)) {
    fs.unlink(pathToOutputFile, (err) => {
      if (err) {
        throw new Error(err?.message);
      } else {
        logger.debug("Старый output файл удалён.");
      }
    });
  }

  const csvWriter = createCsvWriter({
    path: pathToOutputFile,
  });

  csvWriter
    .writeRecords(rows)
    .then(() => logger.info("The CSV file was written successfully"))
    .catch((error) => console.error(error));
}
