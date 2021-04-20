// console.log("hi")


// How to convert an Object {} to an Array [] of key-value pairs in JavaScript?
var obj = { "1": 5, "2": 7, "3": 0, "4": 0, "5": 0 };
    
// Using Object.keys() and map() function
// to convert convert an Object {} to an 
// Array [] of key-value pairs



let currButton = document.querySelector(".side-button-curriculum");
let sideMenu = document.querySelector(".side-menu-hidden");
currButton.addEventListener("click",async ()=>{
    sideMenu.classList.toggle("open");

})

let tbody = document.querySelector("#enrollment-tbody");
window.addEventListener("load", async ()=>{
    let response = await fetch("/search", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
        
        let data = await response.json();

        var result = Object.keys(data).map(function (key) {
        
            // Using Number() to convert key to number type
            // Using obj[key] to retrieve key value
            data[key]['nameid'] = key; 
            return data[key];
        });

        console.log(result);

        let myHTML = "";
        
        result.forEach((data, index)=>{
            console.log("object:",data);
            myHTML += `<tr>
                    <td>${index+1}</td>
                    <td>${data.nameid}</td>
                    <td>${data.description}</td>
                    <td>${data.prereq.join(", ")}</td>
                    <td>${data.coreq.join(", ")}</td>
                    <td><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="green">
                        <path
                        d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.393 7.5l-5.643 5.784-2.644-2.506-1.856 1.858 4.5 4.364 7.5-7.643-1.857-1.857z" />
                    </svg></td>
                </tr>`;
        })
        tbody.innerHTML = myHTML;
})