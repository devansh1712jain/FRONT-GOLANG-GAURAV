import { useEffect, useState } from 'react'
import './App.css'
import {Link} from "react-router-dom"
import axios from 'axios'
import { toast ,Toaster } from 'react-hot-toast'

function App() {
  const [key, setkey] = useState(null)
  const [value, setValue] = useState(null);
  const [timer, setTimer] = useState(0);
  const [data, setData] = useState(null);
  const [getkey, setGetkey] = useState(null)
  const [webSocketState, setWebSocketState] = useState({});

  const setkeyvalue = async()=>{
    console.log(key, value , timer)
    try {
      const post = await axios.post("http://ec2-54-153-173-231.ap-southeast-2.compute.amazonaws.com:8080/cache",{Key:key, Value:value, Time:timer});
      console.log("key value successfully set")
      toast.success("Key value pair successfully added")
      setkey("")
      setValue("")
      setTimer("")

    } catch (error) {
      console.log(error,"error occured");
      toast.error("something went wrong")

    }
  }

  const getkeyvalue = async()=>{
    console.log(key, value , timer)
    try {
      const post = await axios.get("http://ec2-54-153-173-231.ap-southeast-2.compute.amazonaws.com:8080/cache/" + data );
      setGetkey(post.data.value)
      console.log("key value successfully get", post)
      toast.success("Key successfully got")

    } catch (error) {
      console.log(error,"error occured");
      toast.error("Key not found")
    }
  }

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://ec2-54-153-173-231.ap-southeast-2.compute.amazonaws.com:8080/ws');
    newSocket.onopen = () => {
      console.log('Connection established');
      newSocket.send('Hello Server!');
    }
 

    newSocket.onmessage = (event) => {
      try {
        const messageObj = JSON.parse(event.data);
        console.log('WebSocket message received:', messageObj);
    
        switch (messageObj.event) {
          case 'set':
            // Update Recoil state with received message
            setWebSocketState(prevState => ({
              ...prevState, messageObj
            }));
            break;
          case 'expired':
            // Remove the key from the Recoil state
            setWebSocketState(prevState => ({
              ...prevState,
              messages: prevState.messages.filter(msg => msg.key !== messageObj.key)
            }));
            break;
          case 'del':
            // Remove the key from the Recoil state
            setWebSocketState(prevState => ({
              ...prevState,
              messages: prevState.messages.filter(msg => msg.key !== messageObj.key)
            }));
            break;
          default:
            console.error('Unknown event type:', messageObj.event);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };



    setSocket(newSocket);
    
  }, [])
  console.log(socket)
  console.log(webSocketState)

  return (
      <div>
            <Toaster />
        <div className='my-5'>
          <input className='px-2 py-3 mx-2 rounded-lg' type="text" placeholder='enter key' onChange={(e) => {
            setkey(e.target.value)
          }} />
          <input  className='px-2 py-3 mx-2 rounded-lg' type="text" placeholder='enter value' onChange={(e) => {
            setValue(e.target.value)
          }} />
           <input  className='px-2 py-3 mx-2 rounded-lg' type="number" placeholder='enter Timer' onChange={(e) => {
            setTimer(e.target.value)
          }} />
          <button className='' onClick={setkeyvalue} >set key-value-pair</button>
        </div>
        <div className='my-2'>
          <input type="text" placeholder='enter key' className='px-2 py-3 mx-2 rounded-lg'  onChange={(e) => {
            setData(e.target.value)
          }} />
          <button onClick={getkeyvalue}>get value</button>
          <p className='px-2 py-2  my-2 text-white'>{getkey?`value = ${getkey}`:""}</p>
        </div>

        <button><Link to='/getAll'>  Get all the key value pairs</Link></button>
     
      </div>
     
  )
}

export default App
