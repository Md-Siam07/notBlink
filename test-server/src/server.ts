import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import * as Minio from "minio"
import { chunk } from "./routes/submission"

const app = express()

// Middleware
app.use(cors({ origin: "*" }))

// Routers
app.use("/submission", chunk)

const PORT = 4000
app.listen(PORT, () =>
  console.log("\x1b[36m%s\x1b[0m", `Server is Running on port ${PORT}`)
)
