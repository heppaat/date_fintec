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
