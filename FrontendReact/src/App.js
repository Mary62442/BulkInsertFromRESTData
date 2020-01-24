import React, {useState} from 'react';
import './App.scss';
import Form from "./Form.js";

function App() {

  const [infoSubmitted, setInfoSubmitted] = useState({submitted:false, info:{}});
  const [scoreSubmitted, setScoreSubmitted] = useState({submitted:false, score:{}});

  const handleFormSubmit = ({formType, formData}) => {    
    if (formType === "info") setInfoSubmitted({submitted:true, info:formData});
    else  {
      setScoreSubmitted({submitted:true, score:formData});
      let dataToSend = {scoredata:{...infoSubmitted.info, ...formData}};
      console.log(dataToSend);


      fetch('http://35.222.121.136/setscoreinlist', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:"include",
        body: JSON.stringify(dataToSend),
      })
      .then(res => res.json())
      .then(data => console.log('Success:', data))
      .catch(err => console.error('Error:', err));

    }
  };



  

  let infoInputs = [
    {label:"Name", name:"name", type:"text"},
    {label: "City", name:"city", type:"text"},
    {label:"Phone number", name:"phoneNumber", type:"text"}
  ];

  let scoreInputs = [
    {label:"Age", name:"age", type:"number"},
    {label:"Certainty", name:"certainty", type:"number"}
  ];


  return (
    <div className="main-container">
      <h1 className = "title">Guess it!</h1>
      <p className = "presentation">Welcome to the Guess it! app.</p>

      {infoSubmitted.submitted ? (
        <Form formType = "score" inputs = {scoreInputs} onFormSubmit = {handleFormSubmit}></Form>
      ):(
        <Form formType = "info" inputs = {infoInputs} onFormSubmit = {handleFormSubmit}></Form>
      )} 

    </div>
  );
}

export default App;
