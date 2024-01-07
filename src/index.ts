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
//ts data types
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
//zod data types
const mainDataSchema = z.record(
  z.object({
    division: z.string(),
    events: z
      .object({
        title: z.string(),
        date: z.string(),
        notes: z.string(),
        bunting: z.boolean(),
      })
      .array(),
  })
);

type mainData = z.infer<typeof mainDataSchema>;

const printData = (data: mainData) => {
  for (const key in data) {
    console.log(key);
  }
};

const readData = async () => {
  try {
    const input = await readFile(`${__dirname}/../data.json`, "utf-8");
    const jsonData = JSON.parse(input);
    const result = mainDataSchema.safeParse(jsonData);

    if (!result.success) return console.log(result.error.issues);

    const validatedData = result.data;

    printData(validatedData);
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
