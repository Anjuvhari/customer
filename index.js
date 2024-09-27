import express  from "express";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import bodyParser from "body-parser";
import customerRoutes from "./routes/customerRoutes.js";

dotenv.config();

const app = express();
app.use(bodyParser.json())
const PORT = 8080;

app.use('/',customerRoutes);

sequelize.authenticate().then(() => {
    console.log("Database created successfully");
    return sequelize.sync();
}).then(()=> {
    console.log("DB and tables created successfully!");
    app.listen(PORT, () => {
        console.log("Server listening to the PORT ",PORT);
    })
}).catch((err) => {
    console.log(err);
});
