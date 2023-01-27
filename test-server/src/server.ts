import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import * as Minio from "minio"
import { submission } from "./routes/submission"

const app = express()

// Middleware
app.use(cors({ origin: "*" }))
app.use(cookieParser())
app.use(express.json())

// Routers
app.use("/submission", submission)

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
export const minioClient = new Minio.Client({
  accessKey: "minioadmin",
  secretKey: "minioadmin",
  endPoint: "127.0.0.1",
  port: 9000,
  useSSL: false,
})

// Create bucket 'story' if it doesn't exist already
minioClient.bucketExists("story", function (err, exists) {
  if (err) {
    return console.log(err)
  }
  if (!exists) {
    minioClient.makeBucket("story", "us-east-1", function (err) {
      if (err) return console.log("Error creating bucket.", err)
      console.log('Story Bucket Created".')
    })
  }
})

const PORT = 3000
app.listen(PORT, () => console.log("\x1b[36m%s\x1b[0m", `Server is Running on port ${PORT}`))
