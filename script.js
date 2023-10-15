window.addEventListener('load', async () => {
    // Fetch data from crudcrud
    try{
        await fetchDataFromCrudCrud();
    }
    catch (err) {
        console.error('Error fetching Data', err);
    }
    
});

async function fetchDataFromCrudCrud  () {
    try {
        const res = await axios.get("https://crudcrud.com/api/05e06d32e2a74c3b90ca06c734ffc702/data");
        console.log('API',res.data)

        // Split data into completed and uncompleted tasks
        const completedTasks = res.data.filter(task => task.completed);
        const uncompletedTasks = res.data.filter(task => !task.completed);


        for (let i = 0; i < uncompletedTasks.length; i++) {
            ShowUserOnScreen(uncompletedTasks[i], 'ul1');
        }
        for (let i = 0; i < completedTasks.length; i++) {
            ShowUserOnScreen(completedTasks[i], 'ul2');
        }
    } catch (err) {
        console.error('Error updating task on the server:', err);
    }
}

async function crudoperation(event) {
    event.preventDefault();
    const task = event.target.task.value;
    const desc = event.target.desc.value;

    console.log('task',task)
    console.log('desc',desc)

    const obj = {
        task,
        desc,
        completed: false
    };

    try {
        const res = await axios.post("https://crudcrud.com/api/05e06d32e2a74c3b90ca06c734ffc702/data", obj);
        ShowUserOnScreen(res.data,'ul1');
        console.log(res);

    } catch (err) {
        console.error('Error updating task on the server:', err);
    }
}

function createButton(text, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', clickHandler);
    return button;
}

async function markAsDone(obj, element) {
    // Update the task as completed locally
    obj.completed = true;

    // Remove the "Done" and "Delete" buttons
    element.innerHTML = `Task: ${obj.task}, Description: ${obj.desc} (Completed)`;

    const completedTask = document.getElementById('ul2');
    completedTask.appendChild(element);

    try {
        // Update the task as completed on the server
        await axios.put(`https://crudcrud.com/api/05e06d32e2a74c3b90ca06c734ffc702/data/${obj._id}`, obj);
        console.log('Task updated on the server');
    } catch (err) {
        console.error('Error updating task on the server:', err);
    }
}


function ShowUserOnScreen(obj, listId) {
    const parentElem1 = document.getElementById(listId);
    const childElem = document.createElement('li');

    const taskElem =document.createElement('span')
    taskElem.textContent = `Task: ${obj.task}`;

    const descElem = document.createElement('span')
    descElem.textContent =`Description:  ${obj.desc}`

    childElem.appendChild(taskElem);
    childElem.appendChild(descElem);

    // Check if task is completed and remove buttons if it is
    if (obj.completed) {
        parentElem1.appendChild(childElem);
    } else {
        const doneBtn = createButton('Done', () => markAsDone(obj, childElem));
        const delBtn = createButton('Delete', () => deleteTask(obj, childElem));
        childElem.appendChild(doneBtn);
        childElem.appendChild(delBtn);
        parentElem1.appendChild(childElem);
    }
    
}

async function deleteTask(obj, element) {
    const parentElem1 = obj.completed ? document.getElementById('ul2') : document.getElementById('ul1');
    parentElem1.removeChild(element);
    try {
        // Delete from the server
        await axios.delete(`https://crudcrud.com/api/05e06d32e2a74c3b90ca06c734ffc702/data/${obj._id}`);
        console.log('Task deleted from the server');
    } catch (err) {
        console.error('Error updating task on the server:', err);
    }
}