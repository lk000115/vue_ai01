// let buf = new Buffer(10);   不建议使用Buffer()
// let buf = Buffer.from("abcd");
// console.log(buf.toString());

const path = require('path');
console.log(__filename);
console.log(path.basename(__filename));
console.log(path.extname(__filename));

let parseobj = path.parse(__filename);

console.log(parseobj);

