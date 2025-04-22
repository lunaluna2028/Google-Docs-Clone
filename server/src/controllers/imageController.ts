import { Request, Response } from "express"
import path from "path"
import fs from "fs"

export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  return res.status(200).json({ url: imageUrl });
};
