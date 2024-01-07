//import * as fs from 'node:fs';
import { readFile } from "fs/promises";
import { z } from "zod";

let DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type Data2 = Record<
  string,
  {
    division: string;
    events: { title: string; date: string; notes: string; bunting: boolean }[];
  }
>;

type Data = {
  [property: string]: {
    division: string;
    events: { title: string; date: string; notes: string; bunting: boolean }[];
  };
};

const printData = (data: Data) => {
  for (const key in data) {
    console.log(data[key]);
  }
};

const readData = async () => {
  try {
    const input = await readFile(`${__dirname}/../data.json`, "utf-8");
    const jsonData = JSON.parse(input);
    printData(jsonData);
  } catch (error) {
    console.log(error);
  }
};

readData();

// DON'T MODIFY THE CODE BELOW THIS LINE

let toExport;

try {
  toExport = [
    { name: "holidaysByYear", content: holidaysByYear, type: "function" },
  ];
} catch (error) {
  toExport = { error: error.message };
}

export { toExport };
