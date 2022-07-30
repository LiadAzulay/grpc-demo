const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const text = process.argv[2];


// Connecting to server
const client = new todoPackage.Todo("localhost:40000", 
grpc.credentials.createInsecure())
// for debugging
console.log(text)

// Creating TODO
client.createTodo({
    "id": -1,
    "text": text
}, (err, response) => {

    console.log("Recieved from server " + JSON.stringify(response))

})

// the WRONG way, take's a lot to process big date

/*
client.readTodos(null, (err, response) => {
    console.log("read the todos from server " + JSON.stringify(response))
    if (!response.items)
        response.items.forEach(a=>console.log(a.text));
})
*/

// Read TODO'S as stream
const call = client.readTodosStream();
call.on("data", item => {
    console.log("received item from server " + JSON.stringify(item))
})
// Notify when the server end's
call.on("end", e => console.log("server done!"))