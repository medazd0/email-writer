import { useState } from 'react'
import Main from "./mainComponent/Main"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Main />
    </>
  )
}

export default App
