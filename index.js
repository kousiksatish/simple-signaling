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
            socket.on('data', (data) => {
                console.log(`Received data ${data.toString()}`);
                processMessage(data.toString());
            });
        } else {
            console.log(`Name already exists. Closing connection`);
            socket.end();
        }
        
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

function processMessage(msgString) {
    const msg = JSON.parse(msgString)
    if (msg.target !== undefined && msg.target.length !== 0) {
        sendToOneUser(msg.target, msgString);
    } else {
        for(let i=0; i<connectionArray.length; i++) {
            connectionArray[i].socket.write(msgString);
        }
    }
}

function sendToOneUser(name, msgString) {
    for(let i=0; i<connectionArray.length; i++) {
        if (connectionArray[i].name === name) {
            connectionArray[i].socket.write(msgString);
        }
    }
}