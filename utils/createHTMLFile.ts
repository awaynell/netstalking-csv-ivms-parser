import * as fs from "fs";
import http from "http";
import htmlCreator from "html-creator";
import { fileIsExist } from "./common";
import { htmlGenerator } from "./htmlGenerator";

export async function createHTMLFile(rows, logger, pathToOutputFile) {
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

  await fs.appendFile(pathToOutputFile, result, (err) => {
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
