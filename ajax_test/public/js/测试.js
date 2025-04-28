
function fn(obj){
    var default1 = {
        name:'zs',
        age:18,
        sex:'男',
        ...obj
    }
     
    console.log(default1);
}

fn({name:'dddddd',age:20})
