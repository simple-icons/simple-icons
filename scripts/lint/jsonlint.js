const path = require("path");
const Validator = require("jsonschema").Validator;

const rootDir = path.resolve(__dirname, "..", "..");
const schemaFile = path.resolve(rootDir, ".jsonschema.json");
const dataFile = path.resolve(rootDir, "_data", "simple-icons.json");

const schema = require(schemaFile);
const data = require(dataFile);

const validator = new Validator();
const result = validator.validate(data, schema);
if (result.errors.length > 0) {
  result.errors.forEach((error) => {
    console.error(error);
  });

  console.error(`Found ${result.errors.length} error(s) in simple-icons.json`);
  process.exit(1);
}
