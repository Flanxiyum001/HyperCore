const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Store the connected clients
const clients = [];

wss.on('connection', (ws) => {
    console.log('A new client connected');
    clients.push(ws);

    // Send data to the client every 5 seconds (simulating real-time updates)
    setInterval(() => {
        const nodeData = generateRandomNodeData(); // Your function to fetch or generate real-time node data
        ws.send(JSON.stringify(nodeData));
    }, 5000);

    ws.on('close', () => {
        console.log('Client disconnected');
        const index = clients.indexOf(ws);
        if (index !== -1) clients.splice(index, 1);
    });
});

function generateRandomNodeData() {
    // Example: Random data simulating a network of nodes
    const nodes = [
        { id: 1, x: Math.random() * 600, y: Math.random() * 400, status: "active" },
        { id: 2, x: Math.random() * 600, y: Math.random() * 400, status: "inactive" },
        { id: 3, x: Math.random() * 600, y: Math.random() * 400, status: "active" }
    ];
    const links = [
        { source: 1, target: 2 },
        { source: 1, target: 3 }
    ];
    return { nodes, links };
}

console.log('WebSocket server running on ws://localhost:8080');
