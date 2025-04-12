import { Request, Response } from 'express';
import axios from 'axios';

export const getContributions = async (req: Request, res: Response): Promise<void> => {
    const username = process.env.GITHUB_USERNAME; // Use environment variable

    if (!username) {
        res.status(400).json({ error: 'Username is required' });
        return;
    }

    try {
        const response = await axios.get(`https://github-contributions-api.jogruber.de/v4/${username}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contributions' });
    }
};
