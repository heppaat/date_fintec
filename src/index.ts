//import * as fs from 'node:fs';
import { error } from "console";
import { readFile } from "fs/promises";
import { date, z } from "zod";

let DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
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

type DateObject2 = {
  year: number;
  month: number;
  day: number;
  weekday: string;
};

type DataWithDates = {
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

type DataWithWeekday = {
  [property: string]: {
    division: string;
    events: {
      title: string;
      date: DateObject2;
      notes: string;
      bunting: boolean;
    }[];
  };
};

type DataWithHoliday = {
  [property: string]: {
    division: string;
    events: {
      title: string;
      date: DateObject2;
      notes: string;
      bunting: boolean;
    }[];
    ["amount-by-year"]: Holiday;
  };
};

type Holiday = { [property: number]: number };

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
  const newData: DataWithDates = {};
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

//second task

const transformDateBack = (date: DateObject): string => {
  const yearStr = String(date.year);
  const monthStr =
    date.month + 1 < 10 ? "0" + (date.month + 1) : String(date.month + 1); // Adding 1 because months are zero-based
  const dayStr = date.day < 10 ? "0" + date.day : String(date.day);

  return `${yearStr}-${monthStr}-${dayStr}`;
};

//console.log(transformDateBack({ year: 2017, month: 0, day: 2 }));

const getDayOfWeek = (str: string) => {
  const date = new Date(str);
  const dayIndex = date.getUTCDay();
  return DAYS[dayIndex];
};

//console.log(getDayOfWeek("2023-04-10"));

const addWeekDays = (data: DataWithDates): DataWithWeekday => {
  const newData: DataWithWeekday = {};
  for (const key in data) {
    newData[key] = {
      division: data[key].division,
      events: data[key].events.map((event) => ({
        ...event,
        date: {
          ...event.date,
          weekday: getDayOfWeek(transformDateBack(event.date)),
        },
      })),
    };
  }
  return newData;
};

//third task

const holidaysByYear = (events: DataWithWeekday["key"]["events"]): Holiday => {
  const holidays: Holiday = {};

  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    const year = event.date.year;

    if (holidays[year]) {
      holidays[year]++;
    } else {
      holidays[year] = 1;
    }
  }
  return holidays;
};

const addHolidays = (data: DataWithWeekday): DataWithHoliday => {
  const newData: DataWithHoliday = {};
  for (const key in data) {
    newData[key] = {
      division: data[key].division,
      events: data[key].events,
      ["amount-by-year"]: holidaysByYear(data[key].events),
    };
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
    const task2 = addWeekDays(task1);
    const task3 = addHolidays(task2);

    return task3;
  } catch (error) {
    console.log(error);
  }
};

const main = async () => {
  const result = await readData();

  if (result) {
    for (const key in result) {
      console.log(result[key]);
    }
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
