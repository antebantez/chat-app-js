import React, { useState, useEffect } from 'react'


function HomePage() {
  

  /* const startSSE = () => {
    let sse = new EventSource('/api/sse')

    sse.addEventListener('connect', message => {
      let data = JSON.parse(message.data)
      console.log('[connect]', data);
    })

    sse.addEventListener('disconnect', message => {
      let data = JSON.parse(message.data)
      console.log('[disconnect]', data);
    })

    sse.addEventListener('new-message', message => {
      let data = JSON.parse(message.data)
      console.log('[new-message]', data);
    })
  } */

  useEffect(() => {
    //startSSE()
  }, [])

  return (
    <>
      <div>
        <h1>HEJ</h1>
    </div>
    </>
  )
}

export default HomePage