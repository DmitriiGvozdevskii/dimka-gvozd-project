import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import { DARK_COLOR, LIGTH_COLOR, YELLOW_COLOR } from '../utils/colors';

export const Header = observer(() => {

  const { main } = useContext(Context)

  return (
    <div className='Header' style={{
      background: main.isDark ? DARK_COLOR : LIGTH_COLOR
    }}>
      <div className='InnerHeader'>
        <div className='HeaderTitle' style={{
          color: main.isDark ? LIGTH_COLOR : YELLOW_COLOR
        }}>
          ДИМКА
          <div className='HeaderBlock' style={{
            background: main.isDark ? YELLOW_COLOR : DARK_COLOR,
            color: main.isDark ? DARK_COLOR : YELLOW_COLOR
          }}>GVOZD</div>
        </div>
        <div onClick={() => main.setIsDark(!main.isDark)}>
          DARK
        </div>
      </div>
    </div>
  )
})