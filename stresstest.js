var request = require('request');


    const stress = () =>{
        request('http://localhost//',  (error, response, body) => {
       
        stress();
    });
    }
    stress();
   

