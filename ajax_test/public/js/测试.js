// import axios from 'axios'
// function fn(obj){
//     var default1 = {
//         name:'zs',
//         age:18,
//         sex:'男',
//         success:()=>{   },
//         ...obj
//     }
     
//     let res = default1.name

//     default1.success(res);    
// }

// fn({name:'dddddd',age:20,sex:"",success:(res)=>{console.log(res);
// }})

//async修饰的函数包裹的代码,其中异步代码就像同步代码一样执行
// async  function test() {
// await 后面是一个promise对象,会等待promise对象执行完成后再执行后面的代码,注意只能是promise对象,不能是普通对象    
//   await new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//             console.log(1111);
//             resolve()
//         },1000)
//     }) 
//    console.log(2222);

// }
// test()

// console.log(process.cwd())    //运行本文件的当前目录

// function fn(a,b) {

//     a = a == null ? 1 : a;
//     b = b == null ? 0 : b;
//     console.log(` a = ${a}  ---    b = ${b}`); 
// }
// fn(null,8)

let  str = "addsdf.sd"

console.log(str.indexOf('e'));

