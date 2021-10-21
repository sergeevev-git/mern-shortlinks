const express = require("express");
const path = require("path");
const config = require("config");
const mongoose = require("mongoose");

const app = express();

app.use(express.json({ extended: true }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/link", require("./routes/link.routes"));
app.use("/t", require("./routes/redirect.routes"));

//отдача фронта нп продакшн
if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "client", "build")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

const PORT = config.get("PORT") || 5000;

async function start() {
    try {
        await mongoose.connect(config.get("MONGO_URI"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //   useCreateIndex: true,
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`));

start();
