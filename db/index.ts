import { DB, DBOptions } from "./manager";

interface Options {
  region: string;
  endpoint?: string;
}

const TableName = process.env.TABLE_NAME || "Questions";
const ENVIRONMENT = process.env.ENVIRONMENT || "local-db";

let options: Options = {
  region: "",
};

if (ENVIRONMENT === "local-db") {
  options = { region: "localhost", endpoint: "http://127.0.0.1:8000" };
} else {
  options.region = "us-east-1";
}

class QuestionsTable extends DB {
  constructor(options: DBOptions, TableName: string) {
    super(options, TableName);
  }
}

let questionsTable = new QuestionsTable(options, TableName);

export default questionsTable;
