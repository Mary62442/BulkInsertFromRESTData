const { workerData, parentPort } = require('worker_threads');
const request = require('request');

const requestData = {
    scoredata: {
        name :"Mario Rossi",
        city:"Roma",
        age: 55,
        score : 90,
        telephone : "3476543212"
    }
};
    
const iterations = workerData;
let counter = 0;

const stress = () => { 
    request({
        url: "http://localhost/setscoreinlist",
        method: "POST",
        json: requestData
    }, (error, response, body) => {    
        console.log(body);
        counter += 1;
        if(counter === iterations) {
            parentPort.postMessage({ scoresWritten: workerData }); 
            return;           
        }
        stress(); //recursion
    });
}

stress();








