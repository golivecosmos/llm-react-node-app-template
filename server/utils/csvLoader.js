import fs from "fs/promises";
import Papa from "papaparse";

const csvLoader = async (filePath) => {
    console.log('hiiiii')
    try {
        const csvAbsolutePath = await fs.realpath(filePath);
        const data = await fs.readFile(csvAbsolutePath, "utf8");
        return Papa.parse(data, {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true,
        });
    } catch (err) {
        console.error(err);
        throw err;
    }
}
  
  export { csvLoader };