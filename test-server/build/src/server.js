"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var submission_1 = require("./routes/submission");
var app = (0, express_1["default"])();
// Middleware
app.use((0, cors_1["default"])({ origin: "*" }));
// Routers
app.use("/submission", submission_1.submission);
var PORT = 4000;
app.listen(PORT, function () {
    return console.log("\x1b[36m%s\x1b[0m", "Server is Running on port ".concat(PORT));
});
