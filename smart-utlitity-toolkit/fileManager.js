const fs = require("fs");

const filePath = "./test.txt";

console.log("Creating File...");
fs.writeFile(filePath, "Hello Node.js", (err) => {
  if (err) return console.log("Error creating file:", err.message);
  console.log("File Created");

  console.log("Reading File");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return console.log("Error reading file:", err.message);
    console.log(data);

    console.log("Updating File...");
    fs.appendFile(filePath, "\nLearning FS Module", (err) => {
      if (err) return console.log("Error updating file:", err.message);
      console.log("File Updated");

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return console.log("Error reading file:", err.message);
        console.log(data);

        console.log("Deleting File...");
        fs.unlink(filePath, (err) => {
          if (err) return console.log("Error deleting file:", err.message);
          console.log("File Deleted");
        });
      });
    });
  });
});
