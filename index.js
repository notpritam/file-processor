#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import FormData from "form-data";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const argv = yargs(hideBin(process.argv))
  .option("file", {
    alias: "f",
    description: "Path to the file to process",
    type: "string",
    demandOption: true,
  })
  .option("output", {
    alias: "o",
    description: "Output file path",
    type: "string",
    default: "output.txt",
  })
  .option("url", {
    alias: "u",
    description: "URL of the processing server",
    type: "string",
    default: "https://server-extension-r3mw.onrender.com/api/file",
  })
  .help()
  .alias("help", "h").argv;

async function processFile(filePath, outputPath, serverUrl) {
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const response = await fetch(serverUrl, {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.text();
    fs.writeFileSync(outputPath, result);

    console.log(`File processed successfully. Output saved to ${outputPath}`);
  } catch (error) {
    console.error("Error processing file:", error.message);
  }
}

processFile(argv.file, argv.output, argv.url);

// CURL CODE

// ⁠ curl -X POST \
//   -H "Content-Type: multipart/form-data" \
//   -F "file=@input.txt" \
//   https://server-extension-r3mw.onrender.com/api/file -o output.txt ⁠
