//import * as fs from 'node:fs';
import { error } from "console";
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

type DateObject = { year: number; month: number; day: number };

type dataWithDates = {
  [property: string]: {
    division: string;
    events: {
      title: string;
      date: DateObject;
      notes: string;
      bunting: boolean;
    }[];
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

//first task

const transformDate = (str: string) => {
  const date: DateObject = {
    year: 0,
    month: 0,
    day: 0,
  };
  const result: string[] = str.split("-");
  date.year = +result[0];
  date.month = +result[1] - 1;
  date.day = +result[2];
  return date;
};

//console.log(transformDate("2017-01-02"));

const addDatesToMainData = (data: mainData) => {
  const newData: dataWithDates = {};
  for (const key in data) {
    /* newData[key] = {
      division: data[key].division,
      events: data[key].events.map((event) => ({
        ...event,
        date: transformDate(event.date),
      })),
    }; */
    newData[key] = { division: data[key].division, events: [] };
    for (let i = 0; i < data[key].events.length; i++) {
      const event = data[key].events[i];
      newData[key].events.push({
        title: event.title,
        date: transformDate(event.date),
        notes: event.notes,
        bunting: event.bunting,
      });
    }
  }
  return newData;
};

const readData = async () => {
  try {
    const input = await readFile(`${__dirname}/../data.json`, "utf-8");
    const jsonData = JSON.parse(input);
    const result = mainDataSchema.safeParse(jsonData);

    if (!result.success) return console.log(result.error.issues);

    const validatedData = result.data;

    const task1 = addDatesToMainData(validatedData);
    return task1;
  } catch (error) {
    console.log(error);
  }
};

const main = async () => {
  const result = await readData();

  if (result) {
    for (const key in result) {
      console.log(result[key].events);
    }
  } else {
    console.error;
  }
};
main();

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
