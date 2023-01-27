export const chunk = Router()
const file = fs.createWriteStream("./test.mp4")

let count = 1

chunk.put("/", async (req, res) => {
  req.on("data", (chunk) => {
    console.log(`HIT EVENT ${++count}`)
    file.write(chunk)
  })

  req.on("close", () => {
    console.log(`SAVE EVENT ${count}`)
  })

  res.status(200).send()
})
