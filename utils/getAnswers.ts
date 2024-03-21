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
      default: new Date().toLocaleDateString("ru-RU"),
    },
    {
      type: "input",
      name: "fileName",
      message: "Укажи полное название файла без расширения",
      default: 'default'
    },
    {
      type: "input",
      name: "filePart",
      message: "Укажи part файла (только в случае, если до этого ответ был default и part не равно 0)",
      default: '0'
    },
    {
      type: "input",
      name: "countryCode",
      message: "Укажи код страны",
      default: 'rnd'
    },
    {
      type: "input",
      name: "initialNumber",
      message: "С какого номера в названии начнём?",
      default: '1'
    },
  ];

  return inquirer.prompt(questions).then((ans) => {
    console.log(ans)
    return ans;
  });
}
