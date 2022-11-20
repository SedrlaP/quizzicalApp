import { useState, useEffect, useRef } from 'react'
import Question from './Question.jsx'
import { nanoid } from 'nanoid'

function App() {
  const [questions, setQuestions] = useState([])
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizEnded, setQuizEnded] = useState(false)
  const [startAgain, setStartAgain] = useState(false)
  const [score, setScore] = useState()

  // fetch 5 questions from opentdb api
  async function getQuestions() {
    const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple&encode=url3986")
    const data = await res.json()
    setQuestions(data.results.map(setAllQuestions)
    )
  }
  
  function setAllQuestions(q) {
    const id = nanoid()
    return ({
      id : id,
      question : q.question,
      correct: q.correct_answer,
      answers: [...q.incorrect_answers, q.correct_answer].sort().map((ans, index) => (
        {
          q_id: id,
          id: index, 
          answer: ans,
          selected: false,
          correct: q.correct_answer === ans ? true : false
        }
        ))
      })
  }

  // on mount and startAgain change, fetch data from api, save them to questions
  useEffect(() => {
    getQuestions()
  },[startAgain]) 

  // changing quizStarted value
  function startQuiz() {
    setQuizStarted(prevState => !prevState)
  }
  
  function selectAnswer(question_id, answer_id) {
    setQuestions(prevState => prevState.map(q => {
      return question_id === q.id ? {...q, answers: q.answers.map(ans => {
        return answer_id === ans.id ? {...ans, selected: !ans.selected} : {...ans, selected: false}
      })} : {...q}
    }))
  }
  
  function getAnswers() {
    const ans = questions.map(q => q.answers.find(a => {
      return (a.selected && a.correct)
    }))
    let sum = 0
    for (const a of ans) {
      if (a) sum+=1 
    }
    setScore(prev => setScore(prev => sum))
  }
  
  function endQuiz() {
    getAnswers()
    setQuizEnded(prevState => !prevState)
  }

  const questionElements = questions.map(question => (
    <Question 
          key={question.id}
          id={question.id}
          quest={question.question}
          answers={question.answers}
          handleClick={selectAnswer}
          stop={quizEnded}
        />
  ))

  // reset state to default value
  function playAgain() {
    setQuizStarted(prevState => !prevState)
    setQuizEnded(prevState => !prevState)
    setStartAgain(prevState => !prevState)
  }
  
  return (
    <main>
      { !quizStarted ?
        <div className="quiz_wrapper">
          <h1 className="quiz_title">Quizzical</h1>
          <button className="quiz_start" onClick={startQuiz}>Start quiz</button>
        </div> :
        <>
          <div className="question_answer_grid">
            {questionElements}
          </div>
          {!quizEnded ?  
            <button className="btn" onClick={endQuiz}>Check answers</button> :
            <div className="end">
              <div className="score">You scored {score}/5 correct answers</div>
              <button className="btn" onClick={playAgain}>Play again</button>
            </div>
          }
          </>
      } 
    </main>
  )
}

export default App
