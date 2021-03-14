import "../styles.css"
import React, {useContext, useState, useCallback, useEffect} from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import getTemplates from "../../api/getTemplates"

import meetingCreation from "../../api/meetingCreation"

import UserContext from '../../contexts/user-context'


export default function CreateEvent(){
    let location = useLocation()
    let history = useHistory()
    const [toggleRecurrance, setToggle] = useState(false)
    const [toggleCat, setCatToggle] = useState(false)
    const [newCategory, setNewCat] = useState("")

    const [form, setForm] = useState({})
    const [categories, setCategories] = useState([])
    const [templates, setTemplates] = useState([])
    
    const [templateOptions, setTemOptions] = useState([])
    const [categoryOptions, setCatOptions] = useState([])

    const contextUser = useContext(UserContext)
    const user = contextUser.user
    //retriece the categories and the templates from the server for display
    useEffect( ()=>{
         getTemplates({hostid:user.hostid.toString()}).then(temCat=>{
        
            let templates = temCat.templates
            let categories = temCat.categories
           
            setCategories(categories)
            setTemplates(templates)

            let temOptions = []
            let catOptions = []
            categories.forEach((cat,i)=>{
                catOptions.push(<option key={i}> {cat} </option>)
            })

            templates.forEach((tem,i)=>{
                temOptions.push(<option key={i}> {tem[0]} </option>)
            })

            setTemOptions(temOptions)
            setCatOptions(catOptions)
        }).catch(err=>{
            console.log(err.message)
        })
    },[])

    //when a field changes, update the form details appropriately
    function formChange(formObj){
        let name = formObj.target.name
        let value = formObj.target.value
        if(name=="category"){
            if(value == "new"){
                setCatToggle(true)
                setNewCat("")
            }else{
                setCatToggle(false)
                setNewCat(value)
            }  
            return 
        }

        if(name == "newCategory"){
            setNewCat(value)
            return
        }

        if(name == "template"){
            let set = false
            
            templates.forEach((tem,i)=>{
                if(tem[0]==value){
                    name = "templateid"
                    value = templates[i][1].toString()
                    set = true
                }
            })
            if(!set){
                name = "templateid"
                value= null
            }
        }

        let tmpForm = form
        form[name] = value 
        setForm(tmpForm)
        
        
    }
    
    function showRecuranceDropdown(){
        setToggle(toggleRecurrance?false:true)
    }

    function makeNewTemplate(){
        history.push("/CreateTemplate")
    }

    function back(){
        history.goBack()
    }

    //send the form details to the server
    function scheduleEvent(){
        let required = ["meetingname", "duration", "category", "starttime", "templateid"]
        let tmpForm = form
        
        tmpForm.category = newCategory
        
        required.forEach((req,i)=>{
            if(!tmpForm[req] || tmpForm[req]==""){
                console.log("Missing: ",req)
                return // do not send the details with empty fields
            }
        })

        tmpForm.hostid=user.hostid.toString()
        let time =  Date.parse( tmpForm.starttime )
        
        if(time<(new Date())){
            console.log("cannot schedule events in the past")
            return
            //error message

        }

        tmpForm.starttime = time.toString() 
        console.log(tmpForm)
        meetingCreation(tmpForm).then(res=>{
            history.push("/Timetable")
        }).catch(err=>{
            console.log(err.message)
        })

    }

    let newCategoryField = (
        <div className="row">
            <input name="newCategory" type="text" className="form-control" id="catInput" onChange={formChange}/>
            <label id="catInputLabel" htmlFor="name" >New Category Name</label>
        </div>  
    )

    let recurrance =(
        <select name="recurrenceFrequency" id="recurrenceFrequency" onChange={formChange}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
        </select>
    )

    return (
        
        <div>
            <div className="header">
            <button className="white_button" id="back_button" onClick={back}>Back</button>
            <h1>Create New Event</h1>

            </div>
            <div className="wrap">
                <div className="row">
                    <p style={style.genericText}> Event Name: </p>
                    <input name = {"meetingname"}type="text" className="form-control" id="name" onChange={formChange}/>    
                </div>

                <div>
                    <p style={style.genericText}> Select a Category: </p>
                    <select name="category" id="cat" onChange={formChange}>
                        <option> --Select Category-- </option>
                        <option value="new"> Add New Category </option>
                        {categoryOptions}
                    </select>
                </div>
                {toggleCat?newCategoryField:null}
                <div>
                    <p style={style.genericText}>Event Start Time:</p>
                    <input name={"starttime"}type="datetime-local" id="datetime"  onChange={formChange}/>
                </div>

                <div className="oneLine">
                    <p style={style.genericText}> Event Duration (HH:MM:SS): </p>
                    <input name={"duration"} type="text" min={1} className="form-control" id="duration" onChange={formChange}/>
                    
                </div>


                <div className="oneline">
                    <p style={style.genericText}> Make Meeting Recurring: </p>
                    <input name={"recurring"}type="checkbox" id="recurringMeetingCheckbox" onClick={showRecuranceDropdown}/>
                    {toggleRecurrance?recurrance:null}
                </div>

                <div>
                    <p style={style.genericText}> Select an existing template:</p>
                    <select name="template" id="template" onChange={formChange}>
                        <option> --Select Template-- </option> 
                        {templateOptions}
                    </select>
                    <p style={style.genericText}>Or</p>
                    <input type="button" onClick="" value="Make a new Template" onClick={makeNewTemplate}/>
                </div>

                <button className="yellow_button" onClick={scheduleEvent}>Schedule Event</button>

            </div>

        
        </div>
    );
}

const style = {
    genericText:{fontSize: 20, fontWeight: "bold", textAlign: "left"}
}