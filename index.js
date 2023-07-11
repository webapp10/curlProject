require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use((req, res, next) => {
  res.header({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE",
    "Access-Control-Allow-Headers": "*",
  });
  next();
});

app.use(express.json());

app.set('json spaces', 2)

// Mongo URI

mongoose
  .connect(`${process.env.DB_URL}`)
  .then((m) => {
    console.log("🟢 SUCCESS - Database Connected.");
  })
  .catch((e) => {
    console.log("🔴 FAILED - Database Connection Error!");
  });

const saveSchema = new mongoose.Schema({
  name: String,
  data: String,
});

const SaveData = new mongoose.model("data", saveSchema);

app.post("/save", (req, res) => {
  const saveData = new SaveData({
    name: req.body.name,
    data: req.body.data,
  });

  saveData
    .save()
    .then((r) => {
      res.send("[*] data has been saved successfully.");
    })
    .catch((e) => {
      res.send(e);
    });
});

app.get("/save/:search", (req, res) => {
  const key = req.params.search;
  SaveData.find({ name: key }).select(["-_id", "-__v"])
    .then((d) => {
      if (d?.length === 0) {
        res.send("[*] no match found!");
      } else {
        res.send(d);
      }
    })
    .catch((e) => {
      res.send(e);
    });
});

app.get("/", (req, res) => {
  res.send(
    "***********\n\n[*] /save or /code :: Show saved data\n[*] /save/key :: Found the key in database.\n[*] /save/data/{title}/{data} :: Save the title and data to database.\n[*] Alt+F7 :: Clears the CMD history.\n\n***********"
  );
});

app.get("/save", (req, res) => {
  SaveData.find().select(["-_id", "-__v"])
    .then((o) => {
      res.json(o);
    })
    .catch((e) => {
      res.send(e);
    });
});

app.get("/save/data/:title/:data", (req, res) => {
  const saveData = new SaveData({
    name: req.params.title,
    data: req.params.data,
  });

  saveData
    .save()
    .then((r) => {
      res.send("[*] data has been saved successfully.");
    })
    .catch((e) => {
      res.send("[x] something went wrong.");

    });
});

app.get("/code", (req, res) => {
  SaveData.find()
    .then((o) => {
      res.json(o);
    })
    .catch((e) => {
      res.send(e);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server Active on PORT 3000");
});
