const e = require("express")
const { response } = require("express")
const mongoose = require("mongoose")
const Exam = mongoose.model("Exam")
const multer = require("multer")
const Notification = mongoose.model("Notification")

module.exports.generateTable = (req, res) => {
  try {
    let id = req.body.id
    console.log("in generate Table")
    console.log(req.body)
    Exam.findOne({ _id: id }, (err, obj) => {
      if (err) {
        return res.send("not found")
      } else {
        if (obj == null) {
          return res.send("not found")
        }
        let dataArr
        let st = new Set()
        let st2 = new Set()

        for (let i in obj.notification) {
          st.add(obj.notification[i]["email"])
          st2.add(obj.notification[i]["message"])
        }

        let obj3 = {}

        st.forEach((element) => {
          obj3[element] = {}
        })

        for (let i in obj3) {
          st2.forEach((element) => {
            obj3[i]["Email"] = ""
            obj3[i]["fullName"] = ""
            obj3[i][element] = 0
          })
        }
        for (let i in obj.notification) {
          let d = obj.notification[i]
          obj3[d.email][d.message] += 1
          obj3[d.email]["Email"] = d.email
          obj3[d.email]["fullName"] = d.fullName
        }
        res.send(obj3)
      }
    })
  } catch (error) {
    if (error) {
      res.send("No data found")
    }
  }
}

module.exports.viewData = (req, res) => {
  try {
    // console.log("CONTROLLER")
    console.log("LOGG", req.body)

    let id = req.body.id
    let message = req.body.type
    let email = req.body.email

    Exam.findOne({ _id: id }, (err, obj1) => {
      const notification = obj1.notification

      console.log("NOT", notification)

      const finalRes = notification
        .filter((struct) => struct.message == message)
        .filter((struct) => struct.email == email)

      console.log(finalRes.length)
      res.json(finalRes)
    })
  } catch (error) {
    res.send(error)
  }
}
