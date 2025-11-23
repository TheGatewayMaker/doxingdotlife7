import { RequestHandler } from "express";

export const handleMediaProxy: RequestHandler = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing or invalid url parameter" });
    }

    const decodedUrl = decodeURIComponent(url);

    const publicUrl = process.env.R2_PUBLIC_URL;
    if (!decodedUrl.startsWith(publicUrl || "")) {
      return res
        .status(403)
        .json({ error: "Invalid URL - not from allowed R2 storage" });
    }

    const response = await fetch(decodedUrl);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch media from storage" });
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const contentLength = response.headers.get("content-length");

    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Range");
    res.setHeader("Access-Control-Expose-Headers", "Content-Range, Content-Length");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    const buffer = await response.buffer();
    res.send(buffer);
  } catch (error) {
    console.error("Media proxy error:", error);
    res.status(500).json({ error: "Failed to proxy media" });
  }
};
