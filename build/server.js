"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const db_1 = require("./models/db");
const routes_1 = tslib_1.__importDefault(require("./routes/"));
const app = express_1.default();
function initServer() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        app.use(body_parser_1.default.json());
        yield db_1.initDbConnection();
        addRoutes();
        app.listen(3000, () => {
            console.log("Server started at port");
        });
    });
}
exports.initServer = initServer;
function addRoutes() {
    app.use("/api/", routes_1.default);
    app.get("/health", (_, res) => {
        res.send(200);
    });
}
exports.default = app;
