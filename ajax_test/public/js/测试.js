
function fn(obj){
    var default1 = {
        name:'zs',
        age:18,
        sex:'男',
        success:()=>{   },
        ...obj
    }
     
    let res = default1.name

    default1.success(res);    
}

fn({name:'dddddd',age:20,sex:"",success:(res)=>{console.log(res);
}})
