import { Request, Response } from "express";
import axios from 'axios';
import { Stats } from "../models/stats.model";

// Get stats
export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await Stats.findOne(); // Assuming there's only one stats document
    if (!stats) {
      res.status(404).json({
        error: "Not found",
        message: "Stats not found",
      });
      return;
    }

    res.json({
      message: "Stats retrieved successfully",
      stats,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to retrieve stats",
    });
  }
};

export const postStats = async (req: Request, res: Response): Promise<void> => {
  const { projectsDone, yearsOfExperience, hoursOfCoding, cupsOfCoffeeConsumed } = req.body;

  try {
    // Convert string inputs to numbers
    const projectsDoneNum = Number(projectsDone);
    const yearsOfExperienceNum = Number(yearsOfExperience);
    const hoursOfCodingNum = Number(hoursOfCoding);
    const cupsOfCoffeeConsumedNum = Number(cupsOfCoffeeConsumed);

    // Fetch commitsPushed from external API
    const response = await axios.get('http://localhost:5050/api/v1/github/contributions');
    const totalContributions = response.data.total;

    // Calculate the sum of contributions across all years
    const commitsPushed = Object.values(totalContributions).reduce((sum: number, count) => sum + Number(count), 0);

    const stats = await Stats.findOneAndUpdate(
      {},
      { 
        projectsDone: projectsDoneNum, 
        yearsOfExperience: yearsOfExperienceNum, 
        hoursOfCoding: hoursOfCodingNum, 
        commitsPushed, 
        cupsOfCoffeeConsumed: cupsOfCoffeeConsumedNum 
      },
      { upsert: true, new: true }
    );

    res.json({
      message: "Stats created/updated successfully",
      stats,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create/update stats",
    });
  }
};