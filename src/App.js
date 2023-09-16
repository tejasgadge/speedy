import { useState, useEffect,useRef} from "react"
import {generate} from 'random-words'
const NUMB_OF_WORDS = 50
const SECONDS = 60
function App() {

  // let interval;
  const [countDown, setCountDown] = useState(SECONDS);
  const [words, setWords] = useState([]);
  const [currInput, setCurrInput] = useState();
  const textInput = useRef(null)
  const [status, setStatus] = useState("waiting")

  const [currWordIndex, setCurrWordIndex] = useState(0)
  const [currCharIndex, setCurrCharIndex] = useState(-1)
  const [currChar, setCurrChar] = useState("")
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)

  useEffect(() => {
    setWords(generateWords())
  }, [])

  useEffect(() => {
    if (status === 'started') {
      textInput.current.focus()
    }
  }, [status])

  function handleKeyDown({keyCode, key}) {

    // space bar hit
    if (keyCode === 32) {
      checkMatch()
      setCurrInput(" ")
      setCurrWordIndex(currWordIndex + 1)
      setCurrCharIndex(-1)

    // If  backspace is hit
    } else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1)
      setCurrChar("")

    } else {
      setCurrCharIndex(currCharIndex + 1)
      setCurrChar(key)
    }
  }

  function generateWords() {
    return new Array(NUMB_OF_WORDS).fill(null).map(() => generate())
  }

  function start()
  {
    if (status === 'finished') {
      setWords(generateWords())
      setCurrWordIndex(0)
      setCorrect(0)
      setIncorrect(0)
      setCurrCharIndex(-1)
      setCurrChar("")
    }

    if (status !== 'started') {
      setStatus('started')
      let interval = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown <= 0) {
            clearInterval(interval)
            prevCountdown<0?setStatus('waiting'):setStatus('finished')
            setCurrInput("")
            return SECONDS
          } 
          else {
            return prevCountdown - 1
          }
        }  )
      } ,  1000 )
    }
  }

  function reset()
  {
    setStatus('waiting')
    setCountDown(-1)
    setCurrInput("")
    setWords(generateWords())
    setCurrWordIndex(0)
    setCorrect(0)
    setIncorrect(0)
    setCurrCharIndex(-1)
  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex]
    const doesItMatch = wordToCompare === currInput.trim()
    if (doesItMatch) {
      setCorrect(correct + 1)
    } else {
      setIncorrect(incorrect + 1)
    }
  }

  function getCharClass(wordIdx, charIdx, char) {
    if (wordIdx === currWordIndex && charIdx === currCharIndex && currChar && status !== 'finished') {
      if (char === currChar) {
        return "bg-green-400"
      } else {
        return "bg-red-400"
      }
    } else if (wordIdx === currWordIndex && currCharIndex >= words[currWordIndex].length) {
      return "bg-red-400"
    } else {
      return ""
    }
  }

  return (
    <div className="h-full w-full bg-sky-200 ">
      {console.log("hello")}
      <div className="p-20 flex justify-around items-center flex-col">
        <div><span className="text-white  bg-blue-950 rounded-md p-1 text-3xl font-bold w-full float-left">{countDown}</span></div>
        <div className="w-full bg-slate-700 rounded-md m-4 p-2">
          {words.map((word, i) => (
            <span key={i}>
              <span className="text-2xl text-white leading-10 font-normal">
                {word.split("").map((char, idx) => (
                  <span className={getCharClass(i, idx, char)} key={idx}>{char}</span>
                ))}
              </span>
              <span> </span>
            </span>
          ))}
        </div>
        <div className={`m-5 w-full ${status !== "started" ? "hidden" : "visible"}`}>
          <input type="text" disabled={status !== "started"} onKeyDown={handleKeyDown}  ref={textInput} className="border-slate-100 rounded-md p-2 w-full text-2xl font-normal font-mono" value={currInput} onChange={(e)=>{setCurrInput(e.target.value)}}>
          </input>
        </div>
        <button className="text-3xl text-center rounded-lg bg-blue-950 text-white p-2 W-md" onClick={status==='started'?reset:start}>
          {status==="started"?"Reset":"Start"}
          {console.log("hello")}
        </button>
      </div>
      {console.log("Hello")}
      {status === 'finished' && (
          <>
            <div className="flex justify-center gap-2 text-2xl">
              <div className="">Words per minute:</div>
              <div className="">
                {correct}
              </div>
            </div>
            <div className="flex justify-center gap-2 text-2xl font-mono">
              <div className="">Accuracy:</div>
              {correct !== 0 ? (
                <div className="">
                  {Math.round((correct / (correct + incorrect)) * 100)}%
                </div>
              ) : (
                <div className="">0%</div>
                )}
            </div>
          </>
      )}

    </div>
  );
}

export default App;
