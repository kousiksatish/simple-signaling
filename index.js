const net = require('net');

let connectionArray = [];

const server = net.createServer((socket) => {
    console.log(`Connection received`);

    connectionArray.push(socket);
    let entrySucceeded = false;;
    socket.once('data', (data) => {
        clientName = data.toString();
        if (!nameAlreadyExists(data.toString())) {
            const connectionData = {
                name: data.toString(),
                socket: socket
            };
            connectionArray.push(connectionData);
            console.log(`Connection created for ${connectionData.name}`);
            entrySucceeded = true;
        } else {
            console.log(`Name already exists. Closing connection`);
            socket.end();
        }
        
    });
    
    socket.on('data', (data) => {
        console.log(`Received data ${data.toString()}`);
    });

    socket.on('end', () => {
        if (entrySucceeded) {
            removeConnectionEntry(clientName);
        }
        console.log(`Connection disconnected - ${clientName}`);
    });
});


server.listen(8080, () => {
    console.log(`Sever is listening on 8080`);
});

function nameAlreadyExists(name) {
    for(let i=0; i< connectionArray.length; i++) {
        if (connectionArray[i].name === name) {
            return true;
        }
    }
    return false;
}

function removeConnectionEntry(name) {
    const requiredIndex = connectionArray.findIndex((x) => {
        return x.name === name;
    });

    if (requiredIndex !== -1) {
        console.log(`Removed connection entry of ${name}`);
        connectionArray.splice(requiredIndex, 1);
    } else {
        console.log(`Unable to remove connection entry of ${name}`);
    }
    

}