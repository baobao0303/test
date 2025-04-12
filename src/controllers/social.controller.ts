import { Request, Response } from "express";
import { Social } from "../models/social.model";

// Get all social links
export const getSocialLinks = async (req: Request, res: Response): Promise<void> => {
  try {
    const socials = await Social.find();
    res.json({
      message: "Social links retrieved successfully",
      socials,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to retrieve social links",
    });
  }
};

// Update social links
export const updateSocialLinks = async (req: Request, res: Response): Promise<void> => {
  const { socials } = req.body;

  try {
    await Social.deleteMany(); // Clear existing social links
    await Social.insertMany(socials); // Insert new social links

    res.json({
      message: "Social links updated successfully",
      socials,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update social links",
    });
  }
};