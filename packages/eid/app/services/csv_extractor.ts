import path from "path";
import fs from "fs";
import csv from "csv-parser";

export default class ExtractCSVAndPostToETL {
  public async readCSVAndPost(fileName: string) {
    try {
      const filePath = path.join(__dirname, `../uploads${fileName}`);
      console.log('filePath', filePath)
      const fileContents = fs.readFileSync(filePath, "utf-8");

      // Determine if the file is a CD4 or viral load file
      const isViralLoadFile = fileContents.includes("Lab Viral Load");
      const isCD4File = fileContents.includes("CD4_count");

      const rows = await new Promise((resolve, reject) => {
        if (isViralLoadFile) {
          // File is a viral load file, extract columns accordingly
          const results: any = [];
          fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
              const {
                "Lab Viral Load": labViralLoad,
                "Collection Date": collectionDate,
                "Patient CCC No": patientCCCNo,
                "Lab ID": labID,
              } = row;
              // Check if any of the extracted columns are empty
              if (!labViralLoad || !collectionDate || !patientCCCNo || !labID) {
                throw new Error("One or more extracted columns are empty");
              }
              results.push({
                labViralLoad,
                collectionDate,
                patientCCCNo,
                labID,
              });
            })
            .on("end", () => {
              if (results.length === 0) {
                reject("No data extracted from the CSV file");
              }else {
                resolve(results);
              }
            });
        } else if (isCD4File) {
          // File is a CD4 file, extract columns accordingly
          const results: any = [];
          fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
              const {
                "CD4 count": CD4_COUNT,
                "Collection Date": collectionDate,
                "Patient CCC No": patientCCCNo,
                "Lab ID": labID,
              } = row;
              // Check if any of the extracted columns are empty
              if (!CD4_COUNT || !collectionDate || !patientCCCNo || !labID) {
                throw new Error("One or more extracted columns are empty");
              }
              results.push({
                CD4_COUNT,
                collectionDate,
                patientCCCNo,
                labID,
              });
            })
            .on("end", () => {
              console.log("CSV file successfully processed");
              if (results.length === 0) {
                throw new Error("No data extracted from the CSV file");
              }
              resolve(results);
            });
        } else {
          // File is neither a CD4 nor a viral load file
          return reject("File is neither a CD4 nor a viral load file");
        }
      });

      return {
        success: true,
        message: "CSV file successfully processed",
        extractedData: rows,
      };
    } catch (error) {
      console.log("Failed to process CSV file");
    //   throw new Error("Failed to process CSV file");
      return {
        success: false,
        message: "Failed to process CSV file"
      };
    }
  }
}
