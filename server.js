
// js grpc package
const grpc = require("grpc");
// js protocolbuf compiler
const protoLoader = require("@grpc/proto-loader")

// Loading sync the package from proto file
const packageDef = protoLoader.loadSync("todo.proto", {});
// Creating grpc object from package 
const grpcObject = grpc.loadPackageDefinition(packageDef);

const todoPackage = grpcObject.todoPackage;

// Creating grpc Server
const server = new grpc.Server();
// Binding grpc Server to address and port.
// Creating the server without credentials
server.bind("0.0.0.0:40000",
 grpc.ServerCredentials.createInsecure());

// Adding the service from the package to the server
server.addService(todoPackage.Todo.service,
    {
        "createTodo": createTodo,
        "readTodos" : readTodos,
        "readTodosStream": readTodosStream
    });
server.start();

const todos = []

// Creating TODO'S
function createTodo (call, callback) {
    const todoItem = {
        // init simple id's
        "id": todos.length + 1,
        // Getting the TODO'S from the client
        "text": call.request.text
    }
    todos.push(todoItem)
    callback(null, todoItem);
}
// Sending to the client the TODO'S as stream
function readTodosStream(call, callback) {
    
    todos.forEach(t => call.write(t));
    call.end();
}

// Sending to the client the TODO'S as array (less efficient)
function readTodos(call, callback) {
    callback(null, {"items": todos})   
}