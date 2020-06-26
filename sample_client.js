const net = require('net');

if (process.argv[2] === undefined) {
    console.log(`Please provide client name`);
    process.exit(0);
}

const clientName = process.argv[2];

const client = net.connect({
    port: 8080
}, () => {
    console.log('Connected to server');
    client.write(clientName);

    client.on('end', () => {
        console.log('Disconnected from server');
    });
});