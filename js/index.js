

// The following code is for opening side menu of the curriculum window

let currButton = document.querySelector(".side-button-curriculum");
let sideMenu = document.querySelector(".side-menu-hidden");
currButton.addEventListener("click",async ()=>{
    sideMenu.classList.toggle("open");
})

function transformToTableRows(data) {
    let rows = "";
    data.forEach((item)=>{
        rows += `<tr>
                <td>${item.demand}</td>
                <td>${item.nameid}</td>
                <td>${item.description}</td>
                <td>${item.prereq.join(", ")}</td>
                <td>${item.coreq.join(", ")}</td>
                <td><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="green">
                    <path
                    d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.393 7.5l-5.643 5.784-2.644-2.506-1.856 1.858 4.5 4.364 7.5-7.643-1.857-1.857z" />
                </svg></td>
            </tr>`;
    })
    return rows;
}


let globalCourses;

let tbody = document.querySelector("#enrollment-tbody");
window.addEventListener("load", async ()=>{
    let response = await fetch("/search", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', 
        body: JSON.stringify({data: []})
        })
        
        let data = await response.json();

        var result = Object.keys(data).map(function (key) {
        
            // Using Number() to convert key to number type
            // Using obj[key] to retrieve key value
            data[key]['nameid'] = key; 
            return data[key];
        });

        globalCourses = data;
        tbody.innerHTML = transformToTableRows(result);
        await getCurriculum();
})


// The following code is for opening side menu of the curriculum window
let closeButton = document.querySelector("#close-button");
closeButton.addEventListener("click",async ()=>{
    sideMenu.classList.toggle("open");
})



let cbody = document.querySelector("#curriculum-tbody");
const getCurriculum = async ()=>{


    let response = await fetch("/curriculum", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
        
        let curriculums = await response.json();

        let ciicCur = curriculums["CIIC"]; 

        let myHTML = "";
        
        ciicCur.courses.forEach((course, index)=>{
            console.log("object:", course);
            if (course.ID.length == 8){
                if(globalCourses[course.ID]){
                    myHTML += `<tr>
                    <td>${globalCourses[course.ID].semester}</td>
                    <td>${globalCourses[course.ID].nameid}</td>
                    <td>${globalCourses[course.ID].description}</td>
                    <td>${globalCourses[course.ID].prereq.join(", ")}</td>
                    <td>${globalCourses[course.ID].coreq.join(", ")}</td>
                </tr>`;
                }
            }
            else {
                `<tr>
                        <td> </td>
                        <td>${course.ID.nameid}</td>
                        <td> Course Elective </td>
                        <td> </td>
                        <td> </td>
                    </tr>`
            }
        })
        cbody.innerHTML = myHTML;

}

let searchInput = document.querySelector("#search-course-input");

searchInput.addEventListener("keydown", async (e)=>{
    if (e.key === "Enter") {
        const splitted = e.target.value.match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+)?|\.[0-9]+/g);
        let response = await fetch("/search", {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer', 
            body: JSON.stringify({data: splitted})
        })

        let data = await response.json();
        var result = Object.keys(data).map(function (key) {
        
            // Using Number() to convert key to number type
            // Using obj[key] to retrieve key value
            data[key]['nameid'] = key; 
            return data[key];
        });

        tbody.innerHTML = transformToTableRows(result);
    }
})
