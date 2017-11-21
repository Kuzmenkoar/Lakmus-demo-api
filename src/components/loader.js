import React from 'react'
import './loader.css'

let style = {
  color: '#4193ff'
}

export default (props) => <div className='loader-steps'>
  <div style={style} className="la-ball-climbing-dot">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>