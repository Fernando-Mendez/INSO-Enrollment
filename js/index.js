let globalCourses;
let globalCoursesTaken;

// Open Side Menu
let currButton = document.querySelector(".side-button-curriculum");
let sideMenu = document.querySelector(".side-menu-hidden");
currButton.addEventListener("click",async ()=>{
    sideMenu.classList.toggle("open");
})

// Close Side Menu
let closeButton = document.querySelector("#close-button");
closeButton.addEventListener("click",async ()=>{
    sideMenu.classList.toggle("open");
})

// Dropdown Filter
let termDropdown = document.querySelector("#semester-dropdown");
termDropdown.addEventListener("change" , ()=> {
    const data = tranformToObject(globalCourses);
    tbody.innerHTML = transformToTableRows(data);
})

// Main table 
let tbody = document.querySelector("#enrollment-tbody");
window.addEventListener("load", async ()=>{

        auth()

        // ### LOGIN #####
        await getAuth();

        // ### END LOGIN #####

        await getCourses();

        await getCurriculum();
        let checkboxes = document.getElementsByName("curriculum-cb");

        checkboxes.forEach((checkbox)=>{
            checkbox.addEventListener("change", ()=>{
                console.log(checkbox.dataset.id, checkbox.checked)
                postApproved(checkbox.dataset.id, checkbox.checked)
            })
        })
})


// Curriculum table
let cbody = document.querySelector("#curriculum-tbody");
const getCurriculum = async ()=>{
    let response = await fetch("/curriculum", {
        method: 'POST', // *GET, POST, PUT, DELETE
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', 
        referrerPolicy: 'no-referrer', 
        })
        
        let curriculums = await response.json();
        let ciicCur = curriculums["CIIC"]; 
        let myHTML = "";
        
        ciicCur.courses.forEach((course)=>{
            if (course.ID.length == 8){
                if(globalCourses[course.ID]){
                    myHTML += `<tr>
                    <td>${course.term.year}Y${course.term.semester}S</td>
                    <td>${globalCourses[course.ID].nameid}</td>
                    <td>${globalCourses[course.ID].description}</td>
                    <td>${globalCourses[course.ID].prereq.join(", ")}</td>
                    <td>${globalCourses[course.ID].coreq.join(", ")}</td>
                    <td><input type="checkbox" name="curriculum-cb" data-id="${course.ID}" ${ globalCoursesTaken[course.ID] ? "checked": ""}> </td>
                </tr>`;
                }
            }
            else {
                myHTML += `<tr>
                        <td> --- </td>
                        <td> --- </td>
                        <td>${course.ID} Elective</td>
                        <td> --- </td>
                        <td> --- </td>
                        <td> <input type="checkbox" name="curriculum-cb" data-id="${course.ID}" ${ globalCoursesTaken[course.ID] ? "checked": ""}> </td>
                    </tr>`
            }
        })
        cbody.innerHTML = myHTML;

}

// search input filter for course 
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
        var result = tranformToObject(data)

        tbody.innerHTML = transformToTableRows(result);
    }
})






// ################## Functions ##################

function tranformToObject(data) {
    return Object.keys(data).map(function (key) {
        
        // Using Number() to convert key to number type
        // Using obj[key] to retrieve key value
        data[key]['nameid'] = key; 
        return data[key];
    });
}
function transformToTableRows(data) {
    let rows = "";
    data.forEach((item)=>{
        rows += `<tr>
                <td>${item.demand.find(i => i.term == termDropdown.value).quantity}</td>
                <td>${item.nameid}</td>
                <td>${item.description}</td>
                <td>${item.prereq.join(", ")}</td>
                <td>${item.coreq.join(", ")}</td>
                <td><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="green">
                    <path
                    d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.393 7.5l-5.643 5.784-2.644-2.506-1.856 1.858 4.5 4.364 7.5-7.643-1.857-1.857z" />
                </svg>
                </td>
                <td> <input type="checkbox"> </td>
            </tr>`;
    })
    return rows;
}

async function getCourses(){
    let response = await fetch("/search", {
        method: 'POST', // GET, POST, PUT, DELETE
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', 
        referrerPolicy: 'no-referrer', 
        body: JSON.stringify({data: []})
        })
        
        let data = await response.json();

        var result = tranformToObject(data);

        globalCourses = data;
        tbody.innerHTML = transformToTableRows(result);
}

async function getAuth(){
    let response = await fetch("/getAuthData", {
        method: 'POST', // GET, POST, PUT, DELETE
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', 
        referrerPolicy: 'no-referrer', 
        body: JSON.stringify({data: []})
        })
        
        let data = await response.json();

        globalCoursesTaken = data.courses; 
}

async function postApproved(courseID, approve){
    await fetch("/postApproved", {
        method: 'POST', // GET, POST, PUT, DELETE
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', 
        referrerPolicy: 'no-referrer', 
        body: JSON.stringify({data: {id: courseID, approve: approve}})
    })
}

function auth() {
    let LoginForm = document.querySelector("#upr-form-auth");

    LoginForm.addEventListener("submit", async  (e)=>{
        e.preventDefault();

        let data = {
            username:LoginForm.elements["uname"].value,
            password:LoginForm.elements["psw"].value
        }
        
        let response = await fetch("/login", {
            method: 'POST', // GET, POST, PUT, DELETE
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow', 
            referrerPolicy: 'no-referrer', 
            body: JSON.stringify({data: data})
        })

        let parsedResult = await response.json();

        console.log(parsedResult);

    })

}