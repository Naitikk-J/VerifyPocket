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

const initializeCollections = async (db: any) => {
  if (!db) {
    console.warn("⚠️  Skipping collection initialization - database not connected");
    return;
  }
  try {
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c: any) => c.name);

    // Student Portal Collections
    if (!collectionNames.includes('students')) {
      await db.createCollection('students');
      await db.collection('students').createIndex({ walletAddress: 1 }, { unique: true });
      console.log('✓ Created students collection');
    }

    if (!collectionNames.includes('credentials')) {
      await db.createCollection('credentials');
      await db.collection('credentials').createIndex({ studentAddress: 1 });
      await db.collection('credentials').createIndex({ hash: 1 }, { unique: true });
      await db.collection('credentials').createIndex({ issuedAt: -1 });
      console.log('✓ Created credentials collection');
    }

    if (!collectionNames.includes('studentProfiles')) {
      await db.createCollection('studentProfiles');
      await db.collection('studentProfiles').createIndex({ walletAddress: 1 }, { unique: true });
      console.log('✓ Created studentProfiles collection');
    }

    // Admin Portal Collections
    if (!collectionNames.includes('admins')) {
      await db.createCollection('admins');
      await db.collection('admins').createIndex({ walletAddress: 1 }, { unique: true });
      console.log('✓ Created admins collection');
    }

    if (!collectionNames.includes('auditLogs')) {
      await db.createCollection('auditLogs');
      await db.collection('auditLogs').createIndex({ adminAddress: 1 });
      await db.collection('auditLogs').createIndex({ action: 1 });
      await db.collection('auditLogs').createIndex({ createdAt: -1 });
      console.log('✓ Created auditLogs collection');
    }

    if (!collectionNames.includes('institutions')) {
      await db.createCollection('institutions');
      await db.collection('institutions').createIndex({ name: 1 }, { unique: true });
      console.log('✓ Created institutions collection');
    }

    // Verifier Tool Collections
    if (!collectionNames.includes('verifications')) {
      await db.createCollection('verifications');
      await db.collection('verifications').createIndex({ credentialHash: 1 });
      await db.collection('verifications').createIndex({ verifierAddress: 1 });
      await db.collection('verifications').createIndex({ createdAt: -1 });
      console.log('✓ Created verifications collection');
    }

    if (!collectionNames.includes('verificationRequests')) {
      await db.createCollection('verificationRequests');
      await db.collection('verificationRequests').createIndex({ credentialId: 1 });
      await db.collection('verificationRequests').createIndex({ status: 1 });
      await db.collection('verificationRequests').createIndex({ requestedAt: -1 });
      console.log('✓ Created verificationRequests collection');
    }

    console.log('✓ All collections initialized successfully');
  } catch (error) {
    console.error('Error initializing collections:', error);
  }
};

const startServer = async () => {
  try {
    const db = await connectDB();
    await initializeCollections(db);

    app.get('/api/credentials', async (req: Request, res: Response) => {
        if (!db) {
            return res.status(503).json({ error: 'Database connection unavailable' });
        }
        const credentials = await db.collection('credentials').find().toArray();
        res.json(credentials);
    });

    app.post('/api/credentials', async (req: Request, res: Response) => {
        if (!db) {
            return res.status(503).json({ error: 'Database connection unavailable' });
        }
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

    // Admin Portal: Verify Signature
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

    // Student Portal: Get Student Profile
    app.get('/api/student/profile/:address', async (req: Request, res: Response) => {
        if (!db) {
            return res.status(503).json({ error: 'Database connection unavailable' });
        }
        try {
            const { address } = req.params;
            const profile = await db.collection('studentProfiles').findOne({ walletAddress: address.toLowerCase() });
            res.json(profile || { walletAddress: address.toLowerCase(), createdAt: new Date() });
        } catch (error) {
            console.error('Error fetching student profile:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Student Portal: Update Student Profile
    app.post('/api/student/profile', async (req: Request, res: Response) => {
        if (!db) {
            return res.status(503).json({ error: 'Database connection unavailable' });
        }
        try {
            const { walletAddress, name, email, photo, bio } = req.body;

            const result = await db.collection('studentProfiles').updateOne(
                { walletAddress: walletAddress.toLowerCase() },
                {
                    $set: {
                        walletAddress: walletAddress.toLowerCase(),
                        name,
                        email,
                        photo,
                        bio,
                        updatedAt: new Date(),
                    },
                },
                { upsert: true }
            );

            res.json({ success: true, result });
        } catch (error) {
            console.error('Error updating student profile:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Admin Portal: Get Audit Logs
    app.get('/api/admin/logs', async (req: Request, res: Response) => {
        if (!db) {
            return res.status(503).json({ error: 'Database connection unavailable' });
        }
        try {
            const logs = await db.collection('auditLogs')
                .find({})
                .sort({ createdAt: -1 })
                .limit(100)
                .toArray();
            res.json(logs);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Admin Portal: Log Action
    app.post('/api/admin/logs', async (req: Request, res: Response) => {
        if (!db) {
            return res.status(503).json({ error: 'Database connection unavailable' });
        }
        try {
            const { adminAddress, action, details } = req.body;

            const logEntry = {
                adminAddress: adminAddress.toLowerCase(),
                action,
                details,
                createdAt: new Date(),
            };

            const result = await db.collection('auditLogs').insertOne(logEntry);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error creating audit log:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Admin Portal: Get All Institutions
    app.get('/api/admin/institutions', async (req: Request, res: Response) => {
        if (!db) {
            return res.status(503).json({ error: 'Database connection unavailable' });
        }
        try {
            const institutions = await db.collection('institutions').find({}).toArray();
            res.json(institutions);
        } catch (error) {
            console.error('Error fetching institutions:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Admin Portal: Create Institution
    app.post('/api/admin/institutions', async (req: Request, res: Response) => {
        if (!db) {
            return res.status(503).json({ error: 'Database connection unavailable' });
        }
        try {
            const { name, email, walletAddress, logo } = req.body;

            const institution = {
                name,
                email,
                walletAddress: walletAddress.toLowerCase(),
                logo,
                createdAt: new Date(),
            };

            const result = await db.collection('institutions').insertOne(institution);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error creating institution:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Verifier Tool: Get Credential by Hash
    app.get('/api/verifier/credential/:hash', async (req: Request, res: Response) => {
        if (!db) {
            return res.status(503).json({ error: 'Database connection unavailable' });
        }
        try {
            const { hash } = req.params;
            const credential = await db.collection('credentials').findOne({ hash });
            if (!credential) {
                return res.status(404).json({ error: 'Credential not found' });
            }
            res.json(credential);
        } catch (error) {
            console.error('Error fetching credential:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Verifier Tool: Verify Credential
    app.post('/api/verifier/verify', async (req: Request, res: Response) => {
        if (!db) {
            return res.status(503).json({ error: 'Database connection unavailable' });
        }
        try {
            const { credentialHash, verifierAddress } = req.body;

            const credential = await db.collection('credentials').findOne({ hash: credentialHash });
            if (!credential) {
                return res.json({ verified: false, error: 'Credential not found' });
            }

            const verification = {
                credentialHash,
                credentialId: credential._id,
                verifierAddress: verifierAddress.toLowerCase(),
                isValid: true,
                createdAt: new Date(),
            };

            await db.collection('verifications').insertOne(verification);
            res.json({
                verified: true,
                credential: {
                    id: credential._id,
                    studentAddress: credential.studentAddress,
                    certificateTitle: credential.certificateTitle,
                    instituteName: credential.instituteName,
                    issueDate: credential.issueDate,
                    issuedAt: credential.issuedAt,
                },
            });
        } catch (error) {
            console.error('Error verifying credential:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Verifier Tool: Get Verification Status
    app.get('/api/verifier/status/:hash', async (req: Request, res: Response) => {
        if (!db) {
            return res.status(503).json({ error: 'Database connection unavailable' });
        }
        try {
            const { hash } = req.params;
            const verifications = await db.collection('verifications')
                .find({ credentialHash: hash })
                .toArray();
            res.json({
                hash,
                verificationCount: verifications.length,
                lastVerified: verifications.length > 0 ? verifications[0].createdAt : null,
            });
        } catch (error) {
            console.error('Error fetching verification status:', error);
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
