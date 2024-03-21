import * as dotenv from "dotenv";
import * as path from "path";
const Logger = require("@ptkdev/logger");

import { formatDatestring } from "./utils/common";
import { getAnswers } from "./utils/getAnswers";
import { getFile } from "./utils/getFile";

dotenv.config();

const logger = new Logger();
const pathToNesca = process.env.PATH_TO_NESCA;

let pathDate, fileName, filePart, pathToOutputFile, initialNumber, countryCode;

async function main(answers) {
  pathDate = formatDatestring(answers.pathDate);
  fileName = answers.fileName;
  filePart = answers.filePart;
  initialNumber = +answers.initialNumber;
  countryCode = answers.countryCode;
  pathToOutputFile = path.resolve(
    `${pathToNesca}/result_files-${pathDate}`,
    `output.csv`
  );

  getFile(
    pathDate,
    fileName,
    filePart,
    initialNumber,
    logger,
    pathToNesca,
    countryCode,
    pathDate,
    pathToOutputFile
  );
}

// start
try {
  getAnswers().then((answers) => main(answers));
} catch (e) {
  logger.error(e.message);
}
