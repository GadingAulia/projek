const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors"); // Import module 'cors'
const path = require("path");

const app = express();

app.use(cors()); // Gunakan middleware 'cors'
app.use(bodyParser.json());

// Konfigurasi koneksi database
const dbConfig = {
  host: "localhost",
  user: "root", // Ganti dengan username MySQL Anda
  password: "", // Ganti dengan password MySQL Anda
  database: "data_depo",
};

// Buat koneksi ke database

const connection = mysql.createConnection(dbConfig);
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database!");
});

// Fungsi untuk menjalankan query ke database
const query = (queryString, callback) => {
  connection.query(queryString, (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, results);
  });
};

app.use(express.static(path.join(__dirname, "parsing")));

app.post("/receivedata", (req, res) => {
  const { major, minor } = req.body;

  // Query database untuk mendapatkan data sesuai major dan minor
  const queryString = `SELECT * FROM depo WHERE major = ${major} AND minor = ${minor}`;

  query(queryString, (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error in database query." });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: "Data not found." });
      return;
    }

    res.json({ data: results });
  });
});

// Port untuk server
const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
