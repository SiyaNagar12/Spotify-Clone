




const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Serve static files manually (HTML, CSS, JS) if needed
app.use(express.static(__dirname)); // Serve index.html etc. from root

// Serve static files inside songs folder
app.use("/songs", express.static(path.join(__dirname, "songs")));

// ✅ Route to list all folders inside /songs
app.get("/songs/", (req, res) => {
  const songsDir = path.join(__dirname, "songs");

  fs.readdir(songsDir, { withFileTypes: true }, (err, files) => {
    if (err) return res.status(500).send("❌ Error reading songs folder");

    const folderLinks = files
      .filter(file => file.isDirectory())
      .map(dir => `<a href="/songs/${dir.name}/">${dir.name}</a><br>`)
      .join("");

    res.send(folderLinks);
  });
});

// ✅ Route to list mp3s inside any subfolder
app.get("/songs/:subfolder/", (req, res) => {
  const subfolder = req.params.subfolder;
  const folderPath = path.join(__dirname, "songs", subfolder);

  fs.readdir(folderPath, (err, files) => {
    if (err) return res.status(500).send("❌ Error reading subfolder");

    const songLinks = files
      .filter(file => file.endsWith(".mp3"))
      .map(file => `<a href="/songs/${subfolder}/${file}">${file}</a><br>`)
      .join("");

    res.send(songLinks);
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://127.0.0.1:${port}`);
});
