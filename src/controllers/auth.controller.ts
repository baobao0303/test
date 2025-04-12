import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const signIn = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
             res.status(401).json({ 
                error: "Authentication failed",
                message: "User not found" 
            });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                error: "Authentication failed",
                message: "Incorrect password" 
            });
            return;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: '24h',
        });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                linkedinUrl: user.linkedinUrl,
                githubUrl: user.githubUrl
            }
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Internal server error",
            message: "Failed to process request" 
        });
    }
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
    const { email, password, name, phone, linkedin, githubUrl } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
             res.status(400).json({ error: 'Email already exists' });
             return;
        }

        const newUser = new User({ 
            email, 
            password, 
            name, 
            phone, 
            linkedin, 
            githubUrl 
        });

        const user = await newUser.save();
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: '24h',
        });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                linkedin: user.linkedinUrl,
                githubUrl: user.githubUrl
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};