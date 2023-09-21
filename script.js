window.addEventListener('load', ()=> {
    fetchDataFromCrudCrud();
});

const fetchDataFromCrudCrud = () =>{
    axios.get("https://crudcrud.com/api/31104549eeba4663acbc4be5677d325d/data")
    .then((res) => {
        for(var i=0;i<res.data.length;i++){
            ShowUserOnScreen(res.data[i]);
        }
    })
    .catch((err)=> {
        console.error(err);
    })
}

function crudoperation(event){
    event.preventDefault();
    const task=event.target.task.value;
    const desc=event.target.desc.value;
    
    const obj={
        task,
        desc
    }
    axios.post("https://crudcrud.com/api/31104549eeba4663acbc4be5677d325d/data",obj)
        .then((res) => {
            ShowUserOnScreen(res.data);
            console.log(res);
        })
        .catch((err)=> {
            console.error(err);
        })
 }
 function ShowUserOnScreen(obj){
    const parentElem1=document.getElementById('ul1');
    const childElem =document.createElement('li');
    childElem.textContent = `${obj.task} ${obj.desc}`;

    const doneBtn=document.createElement('button')
    doneBtn.value='Done';
    const doneText = document.createTextNode('Done'); 
    doneBtn.appendChild(doneText); 
    doneBtn.addEventListener('click', () => {
        const completedTask = document.getElementById('ul2');
        completedTask.appendChild(childElem);
    });


   const delBtn=document.createElement('button')
   delBtn.value='Delete';
   const deleteText = document.createTextNode('Delete'); 
   delBtn.appendChild(deleteText); 

   delBtn.addEventListener('click',() => {
    parentElem1.removeChild(childElem);
    delDataFromCrudCrud(obj._id);
   });

   childElem.appendChild(doneBtn);
   childElem.appendChild(delBtn);
   parentElem1.appendChild(childElem);
 }


 function delDataFromCrudCrud(id){
    axios.delete(`https://crudcrud.com/api/31104549eeba4663acbc4be5677d325d/data/${id}`)
    .then( (res) => {
        console.log('Data deleted Succesfully');
    })
    .catch( (err) => {
    console.error(err);
})
}