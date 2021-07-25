const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 5050;

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get("/video", (req, res) => {
	const range = req.headers.range;
	if (!range) {
		return res.status(401).json({ error: "Range header required." });
	}

	const videoPath = "test-video.mp4";
	const videoSize = fs.statSync("test-video.mp4").size;

	const CHUNK_SIZE = 10 ** 6;
	const start = Number(range.replace(/\D/g, ""));
	const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

	const contentLength = end - start + 1;
	const headers = {
		"Content-Range": `bytes ${start}-${end}/${videoSize}`,
		"Accept-Ranges": "bytes",
		"Content-Length": contentLength,
		"Content-Type": "video/mp4"
	};

	res.writeHead(206, headers);

	const videoStream = fs.createReadStream(videoPath, { start, end });
	
	videoStream.pipe(res);
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));