
const request = require('request');

const requestData = {
    scoredata: {
        name :"Delfina la gallina",
        city:"Montemanno Hen House",
        age: 2,
        score : 12,
        telephone : "3476543212"
       }
};

const iterations = 25001;
let counter = 0;
    const stress = () => {      
       
        request({
            url: "http://localhost:/setscoreinlist",
            method: "POST",
            json: requestData
        }, (error, response, body) => {
       
           console.log(body);
           counter += 1;
           if(counter === iterations) return;
           stress();

        });  
    }


    stress();
   

