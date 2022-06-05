require('dotenv').config()
const dayjs = require('dayjs')
const express = require('express')
const uuid = require('uuid')
const parse = require('./parse')
const cors = require('cors')

const PORT = process.env.PORT || 8000

const app = express()
const expressWs = require('express-ws')(app)
const expressClients = expressWs.getWss('/')

const typeOf = [
  'success',
  'warning',
  'fail'
]

let notifications = [
  {
    id: 1,
    type: "success",
    title: "Wellcome!",
    content: "desc",
    lastSentAt: dayjs().add('3', 'second').format('YYYY-MM-DDTHH:mm:ss')
  },
  {
    id: 2,
    type: "success",
    title: "Wellcome!",
    content: "desc",
    lastSentAt: dayjs().add('7', 'second').format('YYYY-MM-DDTHH:mm:ss')
  },
  {
    id: 3,
    type: "success",
    title: "Wellcome!",
    content: "desc",
    lastSentAt: dayjs().add('10', 'second').format('YYYY-MM-DDTHH:mm:ss')
  }
]

app.use(express.json())
app.use(cors())

app.ws('/', (ws, req) => {
  ws.send("Подключились")

  setInterval(() => {
    let date = dayjs().format('YYYY-MM-DDTHH:mm:ss')
    notifications.forEach((notification) => {
      if (dayjs(notification.lastSentAt).format('YYYY-MM-DDTHH:mm:ss') === date) {
        ws.send(JSON.stringify({ ...notification, messageType: 'notification' }))
      }
    })
  }, 1000)


  ws.on('message', (msg) => {
    const parsed = JSON.parse(msg)
    if (parsed) {
      if (parsed.message === "pong") {
        ws.send(JSON.stringify({ uuid: ws.uuid, message: "pong" }))
      }
    }
  })
})

app.get('/notifications', (req, res) => {
  return res.json(notifications)
})

app.post('/notifications', (req, res) => {
  let { title, content, type, lastSentAt } = req.body

  if (!title || !content || !type) {
    return res.json({ error: 402, msg: "Не указано одно из требуемых полей" })
  }

  if (!typeOf.includes(type)) {
    return res.json({ error: 402, msg: "Неверно указан тип данных, проверьте его с указанными", typeOf })
  }

  if (lastSentAt !== null) {
    lastSentAt = dayjs(lastSentAt).format('YYYY-MM-DDTHH:mm:ss')
  } else {
    lastSentAt = dayjs().format('YYYY-MM-DDTHH:mm:ss')
  }

  lastSentAt = dayjs(lastSentAt).add('2', 'second')

  let obj = {
    id: notifications.length + 1,
    title,
    content,
    type,
    lastSentAt
  }
  notifications.push(obj)
  return res.json(obj)
})

app.put('/notifications/:id', (req, res) => {
  let { id } = req.params
  if (!id) {
    return res.json({ error: 402, msg: "Не указан id уведомления" })
  }

  let { title, content, lastSentAt } = req.body


  let result = {}

  notifications.forEach(notif => {
    if (notif.id == id) {
      notif.title = title || notif.title
      notif.content = content || notif.content
      notif.lastSentAt = lastSentAt || notif.lastSentAt

      result = notif
    }
  })

  return res.json(result)
})

app.delete('/notifications/:id', (req, res) => {
  let { id } = req.params
  if (!id) {
    return res.json({ error: 402, msg: "Не указан id уведомления" })
  }

  notifications.forEach((i, value) => {
    if (i.id == id) {
      console.log(notifications.length, value)
      let prev = notifications.splice(0, value)
      let next = notifications.splice(value, 1)
      notifications = [...prev, ...next]
    }
  })


  return res.json('удалили ХАХАХАХХАХА')
})

app.listen(PORT, () => console.log(`${PORT} —-> port`))