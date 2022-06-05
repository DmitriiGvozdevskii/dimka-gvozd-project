import { observer } from 'mobx-react-lite';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Context } from '.';
import './App.css'
import { CreateNotification } from './components/CreateNotif';
import { Header } from './components/Header';
import { Notifications } from './components/Notifications';
import { DARK_COLOR, GREY_COLOR, LIGTH_COLOR } from './utils/colors';

const App = observer(() => {

  const { main } = useContext(Context)

  const wsHref = useRef("")

  const [isPaused, setIsPaused] = useState(false);
  const [isNew, setIsNew] = useState({})
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (!isPaused) {
      wsHref.current = new WebSocket(`ws://localhost:8000/`)

      wsHref.current.onopen = () => console.log('Подключён')
      wsHref.current.onclose = () => console.log('Отключён')

      main.setWs(wsHref)

      gettingData()
    }

    return () => wsHref.current.close();
  }, [wsHref, isPaused])

  useEffect(() => {
    setInterval(() => {
      !isPaused && wsHref.current && wsHref.current.send(JSON.stringify({ message: "pong" }))
    }, 3000)
  }, [])

  const gettingData = useCallback(() => {
    if (!wsHref.current) return;

    wsHref.current.onmessage = e => {                //подписка на получение данных по вебсокету
      if (isPaused) return;
      const message = JSON.parse(e.data);
      // setData(message);
      if (message.messageType === 'notification') {
        setIsNew(message)
        let arr = []
        main.notifications.forEach(prev => {
          arr.push(prev)
        })
        arr.push(message)
        main.setNotifications(arr)
      }

      console.log(message)
    };
  }, [isPaused]);

  useEffect(() => {
    if (isNew?.id) {
      setIsActive(true)
      setTimeout(() => {
        setIsActive(false)
      }, 2000)
    }
  }, [isNew])

  return (
    <div className='Main' style={{
      background: main.isDark ? GREY_COLOR : LIGTH_COLOR,
      color: main.isDark ? LIGTH_COLOR : DARK_COLOR,
    }}>
      {isActive &&
        <div className='NotificationAlert'>
          <h1>{isNew?.title}</h1>
          <span>{isNew?.content}</span> <br />
          <span>{isNew?.lastSentAt}</span>
        </div>
      }
      <Header />

      <div className='MainBlock'>
        <CreateNotification />
      </div>
      <Notifications />

    </div>
  );
})

export default App;
