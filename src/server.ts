import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDB from './lib/mongodb';
import { ObjectId } from 'mongodb';
import { recoverMessageAddress } from 'viem';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

const startServer = async () => {
  try {
    const db = await connectDB();

    app.get('/api/credentials', async (req: Request, res: Response) => {
        const credentials = await db.collection('credentials').find().toArray();
        res.json(credentials);
    });

    app.post('/api/credentials', async (req: Request, res: Response) => {
        const { 
            studentAddress, 
            studentName,
            certificateTitle,
            course,
            description,
            instituteName,
            issueDate,
            grade,
            issuerName,
            issuerTitle,
            hash
        } = req.body;

        const newCredential = {
            studentAddress,
            studentName,
            certificateTitle,
            course,
            description,
            instituteName,
            issueDate,
            grade,
            issuerName,
            issuerTitle,
            hash,
            issuedAt: new Date(),
        };

        const result = await db.collection('credentials').insertOne(newCredential);
        res.status(201).json(result);
    });

    app.post('/api/admin/verify-signature', async (req: Request, res: Response) => {
        const { message, signature } = req.body;

        if (!message || !signature) {
            return res.status(400).json({ error: 'Message and signature are required' });
        }

        try {
            const recoveredAddress = await recoverMessageAddress({
                message,
                signature,
            });

            const adminWalletAddress = process.env.ADMIN_WALLET_ADDRESS;

            if (recoveredAddress.toLowerCase() === adminWalletAddress?.toLowerCase()) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        } catch (error) {
            console.error('Error verifying signature:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
