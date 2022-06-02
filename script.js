
//Line 3-58 : Implementing the functionality of the UI
const jsonRadio = document.getElementById("jsonRadio");
const customParaRadio = document.getElementById("customParaRadio");
let jsonBox = document.getElementById("jsonBox");
let customBox = document.getElementById("customBox");
let addParamBoxes = document.getElementById("addParamBoxes");


//hiding the data initially when the page is loaded
document.getElementById("data").style.display = "none";

//if user clicks on json radio, the custom parameters content will be hidden
jsonRadio.addEventListener("click", () => {
    document.getElementById("addParamBoxes").style.display = "none"; //after adding a parameter,when user switches to JSON radio , This line makes sure that the additional parameter don't show up   
    document.getElementById("data").style.display = "block"; //setting the main div to display
    document.getElementById("jsonBox").style.display = "block"; //setting the jsonBox to display data
    document.getElementById("customBox").style.display = "none"; //hiding the custom para box
})

//if user clicks on custom parameter radio, the json content will be hidden
customParaRadio.addEventListener("click", () => {
    document.getElementById("addParamBoxes").style.display = "block";
    document.getElementById("data").style.display = "block";
    document.getElementById("customBox").style.display = "block";
    document.getElementById("jsonBox").style.display = "none";
})


//Add a parameter box if "+" button is clicked 
let paramCounter = 1;                              //counter to count no of parameters added
let addPara = document.getElementById("addPara");  //button id="addPara"
addPara.addEventListener("click", () => {
    let addParamBoxes = document.getElementById("addParamBoxes");
    let removePara = document.getElementsByClassName("removePara");
    //set counter to 1 if there are no additional parameters added
    if (removePara.length == 0) {
        paramCounter = 1;
    }
    let str = `<div><input type="text" placeholder="Parameter ${paramCounter + 1} key" id="additionalKey${paramCounter + 1}" > <input type="text"
    placeholder="Parameter ${paramCounter + 1} value" id="additionalValue${paramCounter + 1}" >
<button class="removePara">-</button></div>`;
    // addParamBoxes.innerHTML += str; //we cannot use this since the complete dom will get changed and the parameters already filled will get refreshed
    //Converting string to a node , so that we can add it to the DOM ,instead of modifying the DOM completely 
    let div = document.createElement('div');
    div.innerHTML = str;
    addParamBoxes.appendChild(div.firstElementChild);

    //remove a parameter box if "-" button is clicked
    removePara = document.getElementsByClassName("removePara");
    for (item of removePara) {
        item.addEventListener("click", (e) => {
            e.target.parentElement.remove();
            let url = document.getElementById("url").value;
            let index=url.indexOf("?");
            console.log("index of ?" , index);
            if(index>0){     //to make sure index=-1 is not taken into consideration(if "?" is not found, index will be -1)
                url=url.slice(0,index);
                document.getElementById("url").value = url;
            }
        })
    }
    paramCounter++;
})

//async function for performing GET operation :
async function getData() {
    let url = document.getElementById("url").value;
    let customParaRadio = document.getElementById("customParaRadio");
    let responseId = document.getElementById("responseId");
    responseId.innerHTML = `Loading...`;
    //modifying the url if only one custom parameter is specified
    if (customParaRadio.checked) {
        let key = document.getElementById("key").value;
        let value = document.getElementById("value").value;
        if (key !== null && value !== null) {
            console.log("inside if")
            let paramData = "?" + key + "=" + value;
            url = url.concat(paramData);
        }

        //check if additional paramaters(more than 1) are present ?
        let removePara = document.getElementsByClassName("removePara");
        //console.log(removePara);
        if (removePara.length > 0) {
            console.log(true);
            let addParamBoxes = document.getElementById("addParamBoxes");
            let innerDivs = addParamBoxes.getElementsByTagName("div");
            for (i = 0; i < innerDivs.length; i++) {
                console.log(innerDivs[i]);
                let keyID = "additionalKey" + (i + 2);
                let valueID = "additionalValue" + (i + 2);
                console.log("key-value", keyID + "-" + valueID);
                let key = document.getElementById(keyID).value;
                let value = document.getElementById(valueID).value;
                console.log(key, value);
                let strNew = "&&" + key + "=" + value;
                url = url.concat(strNew);
            }

        }
    }
    else {
        console.log(false);
    }

    document.getElementById("url").value = url;

    const response = await fetch(url);
    const e = await response.json();
    // responseId.innerText=JSON.stringify(e,null,"\t");
    responseId.innerHTML = `${JSON.stringify(e, null, "\t")}`;

}

//async function for performing POST operation:
async function postData() {
    let url = document.getElementById("url").value;
    let jsonData = document.getElementById("jsonText").value;
    let responseId = document.getElementById("responseId");
    responseId.innerHTML = "Fetching response...";
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    }
    const response = await fetch(url, options);
    const e = await response.json();
    responseId.innerHTML = `${JSON.stringify(e, null, "\t")}`;
}


//Implementing the fetch API for get and post requests
let requestType = document.getElementById("reqType");
let sendBtn = document.getElementById("sendBtn");
sendBtn.addEventListener("click", () => {
    let url = document.getElementById("url").value;
    if (requestType.value == "GET") {
        getData().catch(error => {
            alert("Enter GET URL");
            console.error("Some error occured while performing GET operation");
        });
    }
    else if (requestType.value == "POST") {
        postData().catch(error => {
            alert("Enter POST URL")
            console.error("Some error occured while performing POST operation");
        });
    }
})

//copying the text inside the response field to clipboard
let copy = document.getElementById("copy");
let responseId = document.getElementById("responseId");
copy.addEventListener("click", () => {
    navigator.clipboard.writeText(responseId.innerHTML);
})















