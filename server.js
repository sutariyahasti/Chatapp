// const { createServer } = require('http')
// const { parse } = require('url')
// const next = require('next')
// const mongoose = require("mongoose");
// const dev = process.env.NODE_ENV !== 'production'
// const hostname = 'localhost'
// const port = 3000
// const expressPort = 4000;
// // when using middleware `hostname` and `port` must be provided below
// const app = next({ dev, hostname, port })
// const handle = app.getRequestHandler()
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const express = require("express");
// const expressApp = express();
// const httpServer = createServer(expressApp);




// expressApp.use(cors());
// expressApp.use(bodyParser.json());

// // app.prepare().then(() => {
// //     createServer(async (req, res) => {
// //         try {
// //             // Be sure to pass `true` as the second argument to `url.parse`.
// //             // This tells it to parse the query portion of the URL.
// //             const parsedUrl = parse(req.url, true)
// //             const { pathname, query } = parsedUrl

// //             if (pathname === '/a') {
// //                 await app.render(req, res, '/a', query)
// //             } else if (pathname === '/b') {
// //                 await app.render(req, res, '/b', query)
// //             } else {
// //                 await handle(req, res, parsedUrl)
// //             }
// //         } catch (err) {
// //             console.error('Error occurred handling', req.url, err)
// //             res.statusCode = 500
// //             res.end('internal server error')
// //         }
// //     })
// //         .once('error', (err) => {
// //             console.error(err)
// //             process.exit(1)
// //         })
// //         .listen(port, () => {
// //             console.log(`> Ready on http://${hostname}:${port}`)
// //         })
// // })

// // Start Express server
// expressApp.listen(expressPort, () => {
//     console.log(`Express server listening on http://${hostname}:${expressPort}`);
// });

// // Start Next.js server
// app.prepare().then(() => {
//     httpServer.listen(port, () => {
//         console.log(`Next.js server listening on http://${hostname}:${port}`);
//     });
// });

// // MongoDB connection

// async function connectToDatabase() {
//     try {
//         await mongoose.connect("mongodb://127.0.0.1:27017/CHATAPP", {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log("Database connected");
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error.message);
//     }
// }

// connectToDatabase();