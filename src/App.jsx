import { useState } from 'react'
import { Button } from "@/components/ui/button"
import Chatbot from './Chatbot'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <Chatbot/>  
    </>
  )
}

export default App
