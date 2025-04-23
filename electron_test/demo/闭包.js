//内部函数引用外部函数的变量,产生闭包
// function outer(){
//     let a = 10;
//     function inner(){
//         a += 8;
//         console.log(a);

//     }
//     return inner;
// }

// let fn = outer();      //fn就是inner函数,此时产生了闭包,变量a不会被释放
// fn();
// fn();

// outer()();   
// outer()();  //外部函数和内部函数同时都执行,就会释放变量a的内存,不会产生闭包

//闭包的模块化应用

var  module_status = (function name(params) {
    var status = {
        number: 0,
        color: null       
    };  
    return {
        get(prop) {
            return status[prop];
        },
        set(prop,value) {
            status[prop] = value;
        }
    }


})();
