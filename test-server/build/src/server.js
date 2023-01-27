"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.minioClient = void 0;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var Minio = __importStar(require("minio"));
var submission_1 = require("./routes/submission");
var app = (0, express_1["default"])();
// Middleware
app.use((0, cors_1["default"])({ origin: "*" }));
app.use((0, cookie_parser_1["default"])());
app.use(express_1["default"].json());
// Routers
app.use("/submission", submission_1.submission);
// Connect to MongoDB and then spin up Server
// mongoose
//   .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(_ => {
//     app.listen(process.env.PORT, () =>
//       console.log("\x1b[36m%s\x1b[0m", `Server is Running on port ${process.env.PORT}`)
//     )
//   })
//   .catch(err => console.log(err))
// Initialize Minio
exports.minioClient = new Minio.Client({
    accessKey: "minioadmin",
    secretKey: "minioadmin",
    endPoint: "127.0.0.1",
    port: 9000,
    useSSL: false
});
// Create bucket 'story' if it doesn't exist already
exports.minioClient.bucketExists("story", function (err, exists) {
    if (err) {
        return console.log(err);
    }
    if (!exists) {
        exports.minioClient.makeBucket("story", "us-east-1", function (err) {
            if (err)
                return console.log("Error creating bucket.", err);
            console.log('Story Bucket Created".');
        });
    }
});
var PORT = 3000;
app.listen(PORT, function () { return console.log("\x1b[36m%s\x1b[0m", "Server is Running on port ".concat(PORT)); });
