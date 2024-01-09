import * as fs from "fs";
import { parse } from "csv-parse";
import * as dotenv from "dotenv";
import * as path from "path";
import htmlCreator from "html-creator";
import http from "http";
const Logger = require("@ptkdev/logger");

import { fileIsExist, formatDatestring } from "./utils/common";
import { htmlGenerator } from "utils/htmlGenerator";
import { getAnswers } from "utils/getAnswers";

dotenv.config();
const logger = new Logger();
const pathToNesca = process.env.PATH_TO_NESCA;
const currentDate = new Date().toLocaleDateString("ru-RU").split(".").join("");
let pathDate, fileName, pathToOutputFile, initialNumber, countryCode;

async function main(answers) {
  pathDate = formatDatestring(answers.pathDate);
  fileName = answers.fileName;
  initialNumber = answers.initialNumber;
  countryCode = answers.countryCode;
  pathToOutputFile = path.resolve(
    `${pathToNesca}/result_files-${pathDate}`,
    `output.html`
  );

  getFile(pathDate, fileName);
}

async function getFile(pathDate: string, fileName: string) {
  const pathToFile = path.resolve(
    `${pathToNesca}/result_files-${pathDate}`,
    `${fileName}.csv`
  );

  const rowArr = ["NAME", "IP", "LOGIN", "PASSWORD"];

  initialNumber = initialNumber || 1;

  fs.createReadStream(pathToFile)
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", function (row) {
      rowArr.push(
        `${countryCode} ${currentDate} ${initialNumber}`,
        row[0],
        row[5],
        row[6]
      );
      initialNumber = initialNumber + 1;
    })
    .on("end", function () {
      logger.info("Анализ файла окончен. Начинаю работу...");
      createHTMLFile(rowArr);
      initialNumber = 0;
    })
    .on("error", function (error) {
      logger.error(error.message);
    });
}

function createHTMLFile(rows) {
  if (fileIsExist(pathToOutputFile)) {
    fs.unlink(pathToOutputFile, (err) => {
      if (err) {
        throw new Error(err?.message);
      } else {
        logger.debug("Старый output файл удалён.");
      }
    });
  }

  const htmlContent = rows.map((row, idx) => {
    return {
      type: "div",
      attributes: { id: "item" },
      content: [{ type: "span", content: row }],
    };
  });

  const html = new htmlCreator(htmlGenerator(htmlContent));

  const result = html.renderHTML();

  console.log("pathToOutputFile", pathToOutputFile);

  fs.appendFile(pathToOutputFile, result, (err) => {
    if (err) {
      logger.error(err.message);
    } else {
      logger.info(`Все IP добавлены в output.html по пути ${pathToOutputFile}`);

      fs.readFile(pathToOutputFile, function (err, html) {
        if (err) {
          logger.error(err.message);
        }
        http
          .createServer(function (request, response) {
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write(html);
            response.end();
          })
          .listen(8000);

        logger.info("Открыть файл можно здесь: http://127.0.0.1:8000");
      });
    }
  });
}

// start
try {
  getAnswers().then((answers) => main(answers));
} catch (e) {
  console.log(e);
}
