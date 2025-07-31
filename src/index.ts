import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "./utils/db";
import audit from "express-requests-logger";
import express from "express";
import user_router from "./routes/user_route";
import auth_router from "./routes/auth_route";
import role_router from "./routes/role_route";
import team_router from "./routes/team_route";

const app = express();
const PORT = process.env.PORT;

app.use(audit());
app.use(express.json());

app.use("/api", auth_router);
app.use("/api", user_router);
app.use("/api", role_router);
app.use("/api", team_router);

sequelize.sync({ force: false, alter: false, logging: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    });
});
