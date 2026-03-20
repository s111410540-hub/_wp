function findTargetNode(jsonArrayString, targetId) {
    const nodes = JSON.parse(jsonArrayString);

    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (node.id === targetId) {
            return node.hostname;
        }
    }
    return "Node not found";
}

const networkData = '[{"id": 1, "hostname": "web-01"}, {"id": 2, "hostname": "db-01"}]';
console.log("Found:", findTargetNode(networkData, 2)); // 輸出: db-01