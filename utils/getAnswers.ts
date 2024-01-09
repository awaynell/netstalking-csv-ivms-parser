import inquirer from "inquirer";

export async function getAnswers(): Promise<{
  pathDate: string;
  fileName: string;
}> {
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
    {
      type: "input",
      name: "countryCode",
      message: "Укажи код страны",
    },
    {
      type: "input",
      name: "initialNumber",
      message: "С какого номера в названии начнём?",
    },
  ];

  return inquirer.prompt(questions).then((ans) => {
    return ans;
  });
}
