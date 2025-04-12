import { Request, Response } from "express";
import { User } from "../models/user.model";
import cloudinary from "../config/cloudinary.config";

export const updateSkills = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const { skills } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { skills }, { new: true });

    if (!updatedUser) {
      res.status(404).json({
        error: "Update failed",
        message: "User not found",
      });
      return;
    }

    res.json({
      message: "Skills updated successfully",
      skills: updatedUser.skills,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update skills",
    });
  }
};

export const updateExperience = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const { experience } = req.body;

  try {
    // Validate experience data
    if (!Array.isArray(experience)) {
      res.status(400).json({
        error: "Bad request",
        message: "Experience must be an array",
      });
      return;
    }

    // Validate required fields
    for (const exp of experience) {
      if (!exp.position || !exp.company) {
        res.status(400).json({
          error: "Bad request",
          message: "Position and company are required for each experience",
        });
        return;
      }
    }

    // Sort experiences by startDate in descending order
    const sortedExperience = experience.sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA;
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { experience: sortedExperience },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({
        error: "Update failed",
        message: "User not found",
      });
      return;
    }

    res.json({
      message: "Experience updated successfully",
      experience: updatedUser.experience,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update experience",
    });
  }
};

export const updateProjects = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const { projects } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { projects }, { new: true });

    if (!updatedUser) {
      res.status(404).json({
        error: "Update failed",
        message: "User not found",
      });
      return;
    }

    res.json({
      message: "Projects updated successfully",
      projects: updatedUser.projects,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update projects",
    });
  }
};

export const updateEducation = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const { education } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { education }, { new: true });

    if (!updatedUser) {
      res.status(404).json({
        error: "Update failed",
        message: "User not found",
      });
      return;
    }

    res.json({
      message: "Education updated successfully",
      education: updatedUser.education,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update education",
    });
  }
};

export const updateFeaturedProjects = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const { featuredProjects } = req.body;

  // Validate required fields
  if (!Array.isArray(featuredProjects) || featuredProjects.length === 0) {
    res.status(400).json({
      error: "Bad request",
      message: "Featured projects must be a non-empty array",
    });
    return;
  }

  for (const project of featuredProjects) {
    if (!project.title || !project.description) {
      res.status(400).json({
        error: "Bad request",
        message: "Each project must have a title and description",
      });
      return;
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { featuredProjects }, { new: true });
    if (!updatedUser) {
      res.status(404).json({
        error: "Update failed",
        message: "User not found",
      });
      return;
    }

    res.json({
      message: "Featured projects updated successfully",
      featuredProjects: updatedUser.featuredProjects,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update featured projects",
    });
  }
};

// Update description only
export const updateDescription = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const { description } = req.body;

  if (!description) {
    res.status(400).json({
      error: "Bad request",
      message: "Description is required",
    });
    return;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: { description } }, { new: true });
    if (!updatedUser) {
      res.status(404).json({
        error: "Update failed",
        message: "User not found",
      });
      return;
    }
    res.json({
      message: "Description updated successfully",
      description: updatedUser.description,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update description",
    });
  }
};

// Update avatar only
export const updateAvatar = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;

  // Check if file exists
  if (!req.file) {
    res.status(400).json({
      error: "Bad request",
      message: "Avatar file is required",
    });
    return;
  }

  // Validate file type
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    res.status(400).json({
      error: "Invalid file type",
      message: "Only JPEG, PNG, and GIF images are allowed",
    });
    return;
  }

  try {
    // Upload to cloudinary using the file buffer from Multer
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      resource_type: "image",
    });

    if (!uploadResult?.secure_url) {
      throw new Error("Failed to upload image to cloud storage");
    }

    // Update user avatar in database
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: { avatar: uploadResult.secure_url } }, { new: true });
    if (!updatedUser) {
      res.status(404).json({
        error: "Update failed",
        message: "User not found",
      });
      return;
    }

    res.json({
      message: "Avatar updated successfully",
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    console.error("Avatar update error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Failed to process avatar update",
    });
  }
};

// Get all user information
export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  const userId = process.env.USER_ID; // Use environment variable

  if (!userId) {
    res.status(400).json({
      error: "User ID is required",
      message: "User ID not found in environment variables",
    });
    return;
  }

  const delay = 0; // Changed from 0 to 4000

  try {
    // Add artificial delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const user = await User.findById(userId).select("-password -__v");

    if (!user) {
      res.status(404).json({
        error: "Not found",
        message: "User not found",
      });
      return;
    }

    // Sort experiences by startDate in descending order (newest first)
    const sortedExperience = user.experience.sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA;
    });

    res.json({
      message: "User information retrieved successfully",
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        description: user.description,
        skills: user.skills,
        experience: sortedExperience,
        projects: user.projects,
        education: user.education,
        featuredProjects: user.featuredProjects,
        openToOpportunities: user.openToOpportunities
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to retrieve user information",
    });
  }
};

export const updateOpenToOpportunities = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const { openToOpportunities } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { openToOpportunities },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({
        error: "Update failed",
        message: "User not found",
      });
      return;
    }

    res.json({
      message: "Open to opportunities status updated successfully",
      openToOpportunities: updatedUser.openToOpportunities,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update open to opportunities status",
    });
  }
};
