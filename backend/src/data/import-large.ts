import { addAccounts } from "./aac";

addAccounts("large", function () {
  console.log("Data import complete!");
  process.exit(0);
});
