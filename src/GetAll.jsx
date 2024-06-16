import { useEffect, useState } from 'react'

function GetAll() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://ec2-54-153-173-231.ap-southeast-2.compute.amazonaws.com:8080/ws');
    newSocket.onopen = () => {
      console.log('Connection established');
      newSocket.send('Hello Server!');
    }
    newSocket.onmessage = (message) => {
      console.log('Message received:', message.data);
    }
    setSocket(newSocket);
    
  }, [])
  

  

  return (
    <>
      hi there
    </>
  )
}

export default GetAll