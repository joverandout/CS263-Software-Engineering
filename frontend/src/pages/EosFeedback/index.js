import "../styles.css"
import React, {useContext, useState, useEffect} from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import userFeedback from "../../api/userFeedback"

/**
 * Templates Need to look like this
 * template:{
 *      emotions:[]
 *      questions:[]
 * }
 */

function Question(props){
    if(!props.question){
        return null
    }
    const questionText = props.question.text
    const cb = props.question.callback

    function change(field){
        cb(field.target.value, props.id)
    }
    return(
        <div>
            <span><a>{questionText}</a></span> 
            <div className="row">
                    <input type="text" className="form-control" id="name" name="feedback" onChange={change}/>
                    <label htmlFor="name">Answer</label>
            </div>
        </div>
    )

}


export default function EosFeedback(){
    const location = useLocation()
    const template = location.state.template;
    const meetingdetails = location.state.meetingdetails
    console.log(template)
     
    const questions = template.questions
    const emotions = template.emotions

    const [questionValues, setQValues] = useState([])
    const [questionComponents, setQComponents] = useState([])

    useEffect(()=>{
        let tmpQComponents=[]
        let tmpQValues = []

        questions.forEach(e=>{
            tmpQValues.push(false)
        })

        for(let i=0;i<questions.length;i++){
            let question ={
                text: questions[i],
                callback:onQuestionChange
            }
            tmpQComponents.push(<Question callback={onQuestionChange} question={question} key={i} id={i}/>)
        }
        setQComponents(tmpQComponents)
        setQValues(tmpQValues)
    },[])

    function onQuestionChange(value, id){
        let qVals = questionValues
        qVals[id] = value
        setQValues(qVals)
    }

    function sendFeedback(){
        let now = new Date()
        let h = now.getHours().toString()
        let m = now.getMinutes().toString()
        let s = now.getSeconds().toString()
        let time = h+":"+m+":"+s

        let gText = questionValues.join("~")
        let data={
            generaltext:gText,
            meetingid: meetingdetails.meetingid.toString(),
            companyid: meetingdetails.companyid.toString(),
            rating: "null",
            emotion: "Post",
            ftime:time
        }
        console.log(data)
    }
    

    //todo add meeting name
    return(
        <div>
        <div className="wrap">
            <p>End-of-session feedback</p>
            <h1>{meetingdetails.MeetingName}</h1>
        </div>
        <hr/>
        <p>Thank you for attending this event. Please take a minute to fill in the end-of-session feedback questions below.</p>
        <br></br>
        <div className="wrap">
            <div className="row">
                {questionComponents}
            </div>

            <div>
                <button type="submit" className="green_button" onClick={sendFeedback}>Submit</button>
            </div>
        </div>
    </div>
    )
}