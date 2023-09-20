import express from "express";
import mysql from "mysql";
import cors from "cors";
import crypto from "crypto";

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "root",
  database: "test0915",
});

app.listen(3000, () => {
  console.log("Connected to backend!");
});

app.use(express.json());
app.use(cors());

//DB 암호화
const createHashedPassword = (password) => {
  return crypto.createHash("sha512").update(password).digest("base64");
};

app.get("/", (req, res) => {
  res.json("hello this ts the backend!");
});

app.post("/login", (req, res) => {
  const q = "SELECT * FROM user_info WHERE user_id = ? AND user_pw = ?";
  const hashedpassword = createHashedPassword(req.body.userPw);
  const values = [req.body.userId, hashedpassword];
  db.query(q, [...values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/join", (req, res) => {
  const q =
    "INSERT INTO user_info (`user_id`, `user_pw`, `user_nm`) VALUES (?)";
  const hashedpassword = createHashedPassword(req.body.userPw);
  const values = [req.body.userId, hashedpassword, req.body.userNm];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("User has been created success!!");
  });
});

app.post("/idChk/:id", (req, res) => {
  const userId = req.params.id;
  const q = "SELECT * FROM user_info WHERE user_id = ?";
  db.query(q, [userId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
