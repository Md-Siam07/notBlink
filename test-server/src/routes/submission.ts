import { SecureRequest } from "../middleware/auth"
import { Router, Response } from "express"
import multer from "multer"
import fs from "fs"

export const submission = Router()
const file = fs.createWriteStream("./test.mp4")

let count = 1

submission.put("/", async (req: SecureRequest, res: Response) => {
  req.on("data", (chunk) => {
    console.log(`HIT EVENT ${++count}`)
    file.write(chunk)
  })

  req.on("close", () => {
    console.log(`SAVE EVENT ${count}`)
  })

  res.status(200).send()
})
