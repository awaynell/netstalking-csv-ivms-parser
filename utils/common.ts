import * as fs from "fs";
export const formatDatestring = (date: string) => {
  const formattedDatestring = date
    .split(".")
    .map((str) => {
      if (str.charAt(0) === "0") {
        return str.slice(1);
      }
      return str;
    })
    .join("_");

  console.log("formattedDatestring", formattedDatestring);

  return formattedDatestring;
};

export const fileIsExist = (fileName) => {
  return fs.existsSync(fileName);
};
