import express from "express";
import bodyParser from "body-parser";
import mArg from "utils/mArg";
import mLog from "utils/mLog";
import cors from "cors";
import { TOKEN, PORT } from "@env";
import fs from "fs";

import axios from "axios";
import jwt from "jsonwebtoken";
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

    app.use(bodyParser.urlencoded());
    app.use(bodyParser.json());
    app.use(cors());
    app.post("/login", (req, res) => {
      const { username, password } = req.body;
      let info = {
        username: username,
        password: password
      };
      try {
        fs.writeFileSync("./model/userdb.json", JSON.stringify(info, null));
      } catch (error) {
        console.log("====================================");
        console.log(error);
        console.log("====================================");
      }

      var obj = JSON.parse(fs.readFileSync("./model/userdb.json", "utf8"));
      if (
        username == obj.username &&
        password ==
          obj.password /* Use your password hash checking logic here !*/
      ) {
        //If all credentials are correct do this
        let token = jwt.sign(
          { id: user.id, username: user.username },
          "keyboard cat 4 ever",
          { expiresIn: 129600 }
        ); // Sigining the token
        res.json({
          sucess: true,
          err: null,
          token
        });
        try {
          info.token = token;
          fs.writeFileSync("./model/userdb.json", JSON.stringify(info, null));
        } catch (error) {
          console.log("====================================");
          console.log(error);
          console.log("====================================");
        }
      } else {
        res.status(401).json({
          sucess: false,
          token: null,
          err: "Username or password is incorrect"
        });
      }
    });
    const checkToken = (req, res, next) => {
      const header = req.headers["authorization"];

      if (typeof header !== "undefined") {
        const bearer = header.split(" ");
        const token = bearer[1];

        req.token = token;
        next();
      } else {
        //If header is undefined return Forbidden (403)
        res.sendStatus(403);
      }
    };

    app.get("/", (req, res) => {
      res.send(`Please feel free to use our api in ${host}:${port}/api`);
    });
    app;

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
