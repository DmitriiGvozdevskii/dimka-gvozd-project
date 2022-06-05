import React, { useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'

export const CreateNotification = () => {

  const [notification, setNotification] = useState('')
  const [content, setContent] = useState('')
  const [datetime, setDatetime] = useState('')
  const [type, setType] = useState('success')

  const createNotif = async () => {
    axios.post('http://localhost:8000/notifications', {
      title: notification,
      content,
      lastSentAt: dayjs(datetime),
      type
    }).then(resp => {
      console.log(resp.data)
      if (resp.data?.error) {
        alert(resp.data?.msg)
        return alert
      }
      alert('Уведомление создано')
      window.location.reload()
    })
  }

  return (
    <div className='InnerMainBlock'>
      <div className='MainInputBlock'>
        <h5>Создать уведомление</h5>
        <div className='MainInput'>
          <div style={{ display: 'flex', flexDirection: "column" }}>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="success">success</option>
              <option value="warning">warning</option>
              <option value="fail">danger</option>
            </select>
            <input title='Введите название уведомления' placeholder='Введите название уведомления' value={notification} onChange={e => setNotification(e.target.value)} />
            <textarea value={content} onChange={e => setContent(e.target.value)}></textarea>
            <input title='Введите дату активации уведомления' placeholder='Введите дату активации уведомления' type={'datetime-local'} value={datetime} onChange={e => setDatetime(e.target.value)} />
          </div>
          <button onClick={() => createNotif()}>Создать</button>
        </div>
      </div>
    </div>
  )
}