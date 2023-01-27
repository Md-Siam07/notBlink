import { SecureRequest } from "../middleware/auth"
import { Router, Response } from "express"
import multer from "multer"
import fs from "fs"

export const submission = Router()
const file = fs.createWriteStream("./test.mp4")

submission.put("/", async (req: SecureRequest, res: Response) => {
  req.on("data", (chunk) => {
    console.log("HIT EVENT")
    file.write(chunk)
  })

  req.on("close", () => {
    console.log("CLOSE EVENT")
  })

  res.status(200).send()
})

// files: [
//     {
//       fieldname: 'xml_submission_file',
//       originalname: 'xmlTest_2023-01-19_08-47-10.xml',
//       encoding: '7bit',
//       mimetype: 'text/xml',
//       buffer: <Buffer 3c 3f 78 6d 6c 20 76 65 72 73 69 6f 6e 3d 27 31 2e 30 27 20 3f 3e 3c 61 55 65 53 71 55 73 34 53 75 47 67 4a 77 39 52 46 6a 77 44 47 37 20 69 64 3d 22 ... 648 more bytes>,
//       size: 698
//     }
//   ]
