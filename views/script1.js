function del(idx){
    console.log("ok");
    deleteitem(idx, function(){
        document.getElementById(`${idx}`).remove();
    });
}
function deleteitem(idx, callback){
    var http = new XMLHttpRequest();
    http.open("DELETE", `/api/deleteList/${idx}`);
    console.log(idx);
    http.send();
    http.addEventListener("load", function(){
        //console.log("del");
        callback();
    });
}

function check(index){
    checkServerList(index, function(){
        let ele = document.getElementById(`txt${index}`);
        console.log(document.getElementById(`check${index}`).checked);
        if(document.getElementById(`check${index}`).checked == true){
            //ele.style.textDecoration = "line-through";
            ele.removeAttribute("undone");
            ele.setAttribute("class", "done");
        }
        else if(document.getElementById(`check${index}`).checked == false){
            ele.removeAttribute("done");
            ele.setAttribute("class", "undone");
        }
        console.log("checked");
    });
}
function checkServerList(index, callback){
    var http = new XMLHttpRequest();
    http.open("PUT", `/api/checkList/${index}`);
    console.log(index);
    http.send();
    http.addEventListener("load", function(){
        console.log("che");
        callback();
    });
}
