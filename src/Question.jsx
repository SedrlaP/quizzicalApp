function Question(props) {
    const answerElem = props.answers.map(a => (
        <button key={a.id} 
             onClick={
               () => props.handleClick(props.id, a.id)
             }
            className="answer"
            disabled={props.stop}
            style={props.stop ? 
                (a.selected && a.correct) || (a.correct && !a.selected) ? {backgroundColor: "#94D7A2", color: "black"} : a.selected && !a.correct ? {backgroundColor: "#F8BCBC", color: "#4D5B9E"} : {backgroundColor: "", color: "#4D5B9E"} :
                a.selected ? {backgroundColor: "#D6DBF5"} : {backgroundColor: "", color: "#4D5B9E"}}   
            >   
                {
                    // api returns data in encoded version
                    // decode data
                    decodeURIComponent(a.answer)
                }
        </button>))
    return (
        <>
            <div className="question_answer_wrapper">
                <div className="question">
                    {
                        // api returns data in encoded version
                        // decode data
                        decodeURIComponent(props.quest)
                    }
                </div>
                <div className="answer_wrapper">
                    {answerElem}
                </div>
            </div>
        </>
    )
}

export default Question