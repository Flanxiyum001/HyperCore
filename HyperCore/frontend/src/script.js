const socket = new WebSocket('ws://localhost:5000');

// When WebSocket connects, log the connection
socket.addEventListener('open', () => {
    console.log('Connected to WebSocket');
});

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log("Received node data:", data);

    renderNodeMap(data);
});

// Handle errors in WebSocket connection
socket.addEventListener('error', (error) => {
    console.error('WebSocket Error:', error);
});

// Handle WebSocket closure
socket.addEventListener('close', () => {
    console.log('WebSocket connection closed');
});

// Function to render the node map
function renderNodeMap(data) {
    const svg = d3.select("#node-map");
    
    svg.selectAll("*").remove(); // Clear existing nodes and links

    // Render nodes
    const nodes = svg.append("g")
        .selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 10)
        .attr("fill", d => d.status === "active" ? "green" : "red");

    // Render links
    const links = svg.append("g")
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .attr("x1", d => data.nodes.find(node => node.id === d.source).x)
        .attr("y1", d => data.nodes.find(node => node.id === d.source).y)
        .attr("x2", d => data.nodes.find(node => node.id === d.target).x)
        .attr("y2", d => data.nodes.find(node => node.id === d.target).y)
        .attr("stroke", "black")
        .attr("stroke-width", 2);
}
