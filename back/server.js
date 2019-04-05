import express from "express";
import bodyParser from "body-parser";
import mArg from "utils/mArg";
import mLog from "utils/mLog";
import cors from "cors";

import { TOKEN, PORT } from "@env";
import axios from "axios";
// Entry point function
const start = async () => {
  try {
    const args = mArg({
      "--port": Number,

      // aliases
      "-p": "--port"
    });

    const port = 4242 || PORT;
    const app = express();

    app.use(cors());

    app.get("/", (req, res) => {
      res.send(`Please feel free to use our api in ${host}:${port}/api`);
    });

    app.get("/api/xeu", async (req, res) => {
      try {
        const api_url = `http://data.fixer.io/api/latest?access_key=${TOKEN}&base=EUR&symbols=CHF,CNY,GBP,AUD,USD`;
        const response = await axios.get(api_url);
        res.json(response.data);
      } catch (error) {
        console.log(error);
      }
    });

    app.listen(port, err => {
      if (err) throw err;

      mLog(`Server is running on port ${port}`);
    });
  } catch (err) {
    mLog(err, "red");
    process.exit(42);
  }
};

// Let's Rock!
start();
