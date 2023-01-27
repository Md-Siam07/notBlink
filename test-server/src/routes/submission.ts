import { SecureRequest } from "../middleware/auth"
import { Router, Response } from "express"
import { minioClient } from "../server"
import multer from "multer"

export const submission = Router()
const multerUpload = multer() // https://www.npmjs.com/package/multer

submission.post("/", multerUpload.single("snapshot"), async (req: SecureRequest, res: Response) => {
  // console.log(req)

  try {
    // const fileName = "snapshot"
    await minioClient.putObject("story", "snapshot", req.body.snapshot)

    res.status(200).send()
  } catch (error) {
    console.log(error)

    res.status(500).json({
      errorMessage: "Internal Server Error",
    })
  }
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
