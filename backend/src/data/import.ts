import { addAccounts } from "./aac";

addAccounts("small", function () {
  console.log("Data import complete!");
  process.exit(0);
});
