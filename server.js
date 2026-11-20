const liveServer = require("live-server");
const fs = require("fs");
const path = require("path");

const rootDir = __dirname;

const params = {
    port: 3000,
    host: "127.0.0.1",
    root: rootDir,
    open: false,
    file: "index.html",
    wait: 300,
    middleware: [
        function (req, res, next) {
            // Parse URL
            const urlParts = req.url.split('?');
            let cleanPath = urlParts[0];
            const queryString = urlParts[1] ? '?' + urlParts[1] : '';

            // Redirect /index.html or /index to root /
            if (cleanPath === '/index.html' || cleanPath === '/index') {
                res.writeHead(301, { Location: '/' + queryString });
                res.end();
                return;
            }

            // Strip trailing slash if present (except root)
            if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
                cleanPath = cleanPath.slice(0, -1);
            }

            // Check if cleanPath (without extension) corresponds to an .html file
            if (cleanPath !== '/' && !path.extname(cleanPath)) {
                const targetFile = path.join(rootDir, cleanPath.slice(1) + '.html');
                if (fs.existsSync(targetFile)) {
                    req.url = cleanPath + '.html' + queryString;
                }
            }
            next();
        }
    ]
};

liveServer.start(params);
console.log("Geniebag Clean URL Dev Server started on http://localhost:3000");
