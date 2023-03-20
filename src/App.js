import './App.css';
import React from "react"
import Die from './Components/Die';
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'

export default function App() {
  const [presentGame, setPresentGame] = React.useState({clickCount:0})
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [bestScore, setBestScore] = React.useState(parseInt(localStorage.getItem('bestScore')) || 0);

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
        setTenzies(true)
        console.log("You won!")
    }
  }, [dice])

  function generateNewDie() {
    return {
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
    }
  }

  function allNewDice() {
    const newDice=[]
    for (let i=0; i<10; i++) {
      newDice.push(generateNewDie())
    }

    return newDice
  }

  function rollDice() {
    if(!tenzies){
      setDice(oldDice=>oldDice.map(die => {
        return die.isHeld ? die : generateNewDie()
      }))
      countClick()
    } else {
      setDice(allNewDice())
      setTenzies(false)
      setPresentGame({clickCount:0})
    }
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
        return die.id === id ? 
            {...die, isHeld: !die.isHeld} :
            die
    }))
  }

  function countClick(){
    let CountButtonHomeClicks = presentGame.clickCount
    CountButtonHomeClicks += 1
    console.log(CountButtonHomeClicks)
    setPresentGame({clickCount:CountButtonHomeClicks});
  }

  function handleGameOver(playerScore) {
    if (playerScore < bestScore || bestScore === 0) {
      setBestScore(playerScore);
      localStorage.setItem('bestScore', playerScore);
    }
  }

  const diceCollection = dice.map(die => {return (<Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={()=>holdDice(die.id)}/>)})
  /**const diceCollection = dice.map(die => <Die key={die.id} value={die}/>) 也可 */



  return (
    <main>
      {tenzies&&(<Confetti/>)}
      {tenzies&&handleGameOver(presentGame.clickCount)}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container" >
        {diceCollection}
      </div>
      <button className="roll-dice" onClick={rollDice} >{tenzies?"New Game":"Roll"}</button>
      <div className="bottom-area">
        <h3 className="count">Count: {presentGame.clickCount}</h3>
        <h3 className="high-score">Best Score: {bestScore}</h3>
      </div>
    </main>
  );
}


