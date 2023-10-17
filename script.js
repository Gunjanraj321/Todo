const todoApiUrl = "https://crudcrud.com/api/abe068a8862147e7a776175b4d02bef4/task"
const completedApiUrl = "https://crudcrud.com/api/abe068a8862147e7a776175b4d02bef4/tasks"

async function fetchDataFromCrudCrud() {
    try {
        const todoResponse = await axios.get(todoApiUrl);
        const completedResponse = await axios.get(completedApiUrl);

        const todoList = document.getElementById('toDoList')
        const completedList = document.getElementById('taskDone')

        todoList.innerHTML = '<h2>Todo Task</h2>'
        completedList.innerHTML = "<h2>Completed Task</h2>"

        const todoTasks = todoResponse.data;
        const completedTasks = completedResponse.data;

        todoTasks.forEach((task) => {
            const taskItem = createTaskElement(task,true);
            todoList.appendChild(taskItem);
        })

        completedTasks.forEach((task) => {
            const taskItem = createTaskElement(task,false)
            completedList.appendChild(taskItem)
        })

    } catch (err) {
        console.error('Error in fetching data:', err);
    }
}

//function to create a task element with 'done' button

function createTaskElement(task,isTodo){
    const taskItem = document.createElement('div')
    const list = isTodo ? "todoList" : "completedList";
    taskItem.innerHTML = `
    <span>${task.taskName} - ${task.taskDescription}</span>
    <button onclick="moveToCompleted('${task._id}')">Done</button>
    <button onclick="deleteTask('${task._id}', '${list}')">Delete</button>
  `;
    return taskItem;
}

async function addTask(){
    const taskName = document.getElementById('task').value;
    const taskDescription = document.getElementById('desc').value;

    if(taskName){
        try{
            await axios.post(todoApiUrl, {
                taskName,
                taskDescription,
            });
            fetchDataFromCrudCrud();
        }
        catch(error){
            console.error('error adding Task',error)
        }
    }
}

async function deleteTask(taskId, list) {
    const apiUrl = list === 'todoList' ? todoApiUrl : completedApiUrl;

    try {
        // Delete from the server
        await axios.delete(`${apiUrl}/${taskId}`);
        fetchDataFromCrudCrud();
        }
        catch (err) {
        console.error('Error deleting task on the server:', err);
    }
}

async function moveToCompleted(taskId) {
    try {
        const task = await axios.get(`${todoApiUrl}/${taskId}`)

        await axios.post(completedApiUrl, {
            taskName: task.data.taskName,
            taskDescription: task.data.taskDescription
        })
        deleteTask(taskId,"todoList")
    }catch(err){
        console.log("error moving to completed",err)
    }
}

fetchDataFromCrudCrud();

document
    .querySelector('button[type="submit"]')
    .addEventListener("click",addTask)
