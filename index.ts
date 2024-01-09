import * as fs from "fs";
import { parse } from "csv-parse";
import * as dotenv from "dotenv";
import * as path from "path";
import inquirer from "inquirer";
import { fileIsExist, formatDatestring } from "./utils/common";

const mockData = "4_12_2023";
const mockFileName = "hikkafile_4_12_2023_part_0";

dotenv.config();
const pathToNesca = process.env.PATH_TO_NESCA;
import htmlCreator from "html-creator";

async function main(answers) {
  const formattedDate = formatDatestring(answers.pathDate);

  getFile(formattedDate, answers.fileName);
}

function getFile(pathDate: string, fileName: string) {
  const pathToFile = path.resolve(
    `${pathToNesca}/result_files-${mockData}`,
    `${mockFileName}.csv`
  );

  const rowArr = [];

  // fs.readFile(pathToFile, "utf8", (err, data) => {
  //   console.log(data);
  // });

  fs.createReadStream(pathToFile)
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", function (row) {
      rowArr.push(row);
    })
    .on("end", function () {
      console.log(rowArr);
    })
    .on("error", function (error) {
      console.log(error.message);
    });

  createHTMLFile();
}

async function getAnswers(): Promise<{ pathDate: string; fileName: string }> {
  const questions = [
    {
      type: "input",
      name: "pathDate",
      message: "Какой даты папка с находками? (напр. 09.01.2024)",
    },
    {
      type: "input",
      name: "fileName",
      message: "Укажи полное название файла",
    },
  ];

  return inquirer.prompt(questions).then((ans) => {
    return ans;
  });
}

function createHTMLFile() {
  if (fileIsExist("output.html")) {
    fs.unlink("output.html", (err) => {
      throw new Error(err.message);
    });
  }
  const html = new htmlCreator([
    {
      type: "head",
      content: [{ type: "title", content: "Generated HTML" }],
    },
    {
      type: "body",
      attributes: { style: "background-color: black; color: white;" },
      content: [
        {
          type: "div",
          content: [
            {
              type: "span",
              content: "A Button Span Deluxe",
              attributes: { className: "button" },
            },
            {
              type: "a",
              content: "Click here",
              attributes: { href: "/path-to-infinity", target: "_blank" },
            },
          ],
        },
        {
          type: "table",
          content: [{ type: "td", content: "I am in a table!" }],
        },
      ],
    },
  ]);

  const result = html.renderHTML();

  fs.appendFile("output.html", result, (err) => {
    console.log(err);
  });
}

// start
try {
  getAnswers().then((answers) => main(answers));
} catch (e) {
  console.log(e);
}
