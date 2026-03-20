function getSuspiciousIPs(connections) {
    let suspicious = [];
    
    for (let i = 0; i < connections.length; i++) {
        let conn = connections[i];
        if (conn.failedAttempts >= 5) {
            suspicious.push(conn.ip);
        }
    }
    return suspicious;
}

const trafficLog = [
    { ip: "192.168.1.10", failedAttempts: 2 },
    { ip: "10.0.0.45", failedAttempts: 7 },
    { ip: "172.16.0.8", failedAttempts: 12 }
];
console.log("Suspicious IPs:", getSuspiciousIPs(trafficLog)); // 輸出: [ '10.0.0.45', '172.16.0.8' ]