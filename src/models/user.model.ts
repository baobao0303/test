import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    description: { type: String },
    skills: [{ type: String }],
    avatar: {
        public_id: { type: String },
        url: { type: String }
    },
    experience: [{
        position: { type: String, required: true },
        company: { type: String, required: true },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String },
        details: [{ type: String }],
        image: { type: String }
    }],
    featuredProjects: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        technologies: [{ type: String }],
        githubLink: { type: String },
        websiteLink: { type: String },
        cover: { type: String } 
    }],
    projects: [{
        name: { type: String },
        description: { type: String },
        technologies: [{ type: String }],
        url: { type: String }
    }],
    education: [{
        degree: { type: String },
        institution: { type: String },
        fieldOfStudy: { type: String },
        startDate: { type: Date },
        endDate: { type: Date }
    }],
    openToOpportunities: { type: Boolean, default: true }, 
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

export const User = mongoose.model('User', userSchema);