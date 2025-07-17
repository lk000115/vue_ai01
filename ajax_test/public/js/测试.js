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

let  str = " 建筑服务 24432000000109851740 2024 年 08 月 21 日 长沙申大科技集团股份有限公司 91430100712159116H 湖南客偲家装饰工程有限公司 91430102MA4PX7RC64 ¥ 2564.36 ¥ 25.64 贰仟伍佰玖拾圆整 ¥ 2590.00 廖亚飞 * 建筑服务 * 外墙维修 湖南省长沙市岳麓区高新区麓 谷大道 599 号 1% 2564.36 25.64 外墙维修 土地增值税项目编号 :-; 跨地（市）标志 : 否 ; 收款人 : 廖亚飞 ; 复核人 : 张宏 ;  "

// let reg = /\S*公司/g;     // 匹配以公司结尾的字符串
let reg = /¥\s+\d+\.\d+/g   // 匹配以¥开头，后面有空格，接着是数字和小数点的字符串
// 获取字符串str中第二个带公司的字符串
let matches = str.match(reg);

console.log(matches);

// let str1 = "sdfsdfsfsdf   dsdsdsd  $300.12  sdsd   weqsdfsasdfas   $600.32  gddsfsfsfsdf"

// let reg1 = /¥\s+\d+\.\d+/g

// let matches1 = str1.match(reg1)

// console.log('-----',matches1);
