import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '..'
import { DARK_COLOR, GREY_COLOR, LIGTH_COLOR, YELLOW_COLOR } from '../utils/colors'
import dayjs from 'dayjs'
import axios from 'axios'

export const Notifications = observer(() => {
  const { main } = useContext(Context)

  const [selectedItem, setSelectedItem] = useState(null)
  const [activePage, setActivePage] = useState(0)

  useEffect(() => {
    axios.get(`http://localhost:8000/notifications?page=${activePage}`).then((resp) => {
      main.setNotifications(resp.data)
    })
  }, [])

  const dropItem = (id) => {
    axios.delete(`http://localhost:8000/notifications/${id}`).then((resp) => {
      console.log(resp.data)
      alert('Удалили')
      window.location.reload()
    })
  }

  useEffect(() => {
    console.log(selectedItem)
  }, [selectedItem])

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState(null)
  return (

    <div className='NotificationContainer' style={{
      background: main.isDark ? GREY_COLOR : LIGTH_COLOR,
      color: main.isDark ? LIGTH_COLOR : DARK_COLOR,
    }}>
      {main.notifications.map(card =>
        <div key={card.id} id={card.id} className='NotificationCard' style={{
          border: `1px solid ${card.type === 'success' ? "green" : card.type === 'warning' ? YELLOW_COLOR : 'red'}`
        }}>
          <div>
            <span>{selectedItem?.id === card?.id ? <input value={date} onChange={e => setDate(e.target.value)} type='datetime-local' /> : dayjs(card.lastSentAt).format('YYYY-MM-DDTHH:mm:ss')}</span>
            {selectedItem?.id === card?.id ? <input value={title} onChange={e => setTitle(e.target.value)} /> : <h2>{card.title}</h2>}
            <span>{selectedItem?.id === card?.id ? <input value={content} onChange={e => setContent(e.target.value)} /> : card.content}</span>
          </div>

          <div className='NotificationButtons'>
            <button
              style={{
                color: main.isDark ? LIGTH_COLOR : DARK_COLOR,
                border: `1px solid ${YELLOW_COLOR}`
              }}
              className='NotificationButton warning'
              onClick={() => {
                if (card.id !== selectedItem?.id) {
                  setSelectedItem(card)
                } else {
                  setSelectedItem(null)
                  axios.put(`http://localhost:8000/notifications/${selectedItem?.id}`, {
                    title,
                    content,
                    lastSentAt: date
                  }).then(resp => {
                    alert('Обновили')
                    console.log(resp.data)
                    window.location.reload()
                  })
                  if (title.length > 0) {
                    card.title = title
                    setTitle(null)
                  }
                }
              }}
            >{selectedItem?.id === card.id ? "Сохранить" : "Изменить"}
              <div className='NotificationBackgroundButton'></div>
            </button>
            <button style={{
              color: main.isDark ? LIGTH_COLOR : DARK_COLOR,
              border: `1px solid ${YELLOW_COLOR}`
            }} className='NotificationButton warning' onClick={() => dropItem(card.id)}>Удалить
              <div className='NotificationBackgroundButton'></div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
})