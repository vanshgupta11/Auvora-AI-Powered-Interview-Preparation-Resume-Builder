async function test() {
    try {
        const response = await fetch("http://localhost:3000/api/interview/resume2/upload", { method: 'POST' });
        console.log("Status:", response.status);
    } catch (err) {
        console.log("Error:", err.message);
    }
}
test();
