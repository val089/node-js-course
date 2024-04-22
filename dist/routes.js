import fs from 'fs';
export const routes = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html>');
        // res.write('<head><title>Enter Message</title><head>');
        // res.write(
        //   '<body><h1>HELLO!</h1><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
        // );
        res.write('<head><title>Create User</title><head>');
        res.write('<body><h1>HELLO!</h1><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Create user</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            try {
                fs.writeFileSync('message.txt', message);
            }
            catch (error) {
                console.log('dupa', error);
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            }
        });
    }
    if (url === '/users') {
        res.write('<html>');
        res.write('<head><title>Users</title><head>');
        res.write('<body><h1>Users</h1><ul><li>User 1</li><li>User 2</li><li>User 3</li></ul></body>');
        res.write('</html>');
        return res.end(); // zapobiegamy wykonywaniu kodu dalej
    }
    if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split('=')[1];
            console.log(username);
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
        });
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Landing Page</title><head>');
    res.write('<body><h1>Hello on my page!</h1></body>');
    res.write('</html>');
    return res.end();
};
//# sourceMappingURL=routes.js.map