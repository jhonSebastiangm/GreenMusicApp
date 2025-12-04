import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  onModuleInit() {
    try {
      console.log('[FIREBASE] Initializing Firebase Admin...');
      
      if (!process.env.FIREBASE_PROJECT_ID) {
        console.error('[FIREBASE] FIREBASE_PROJECT_ID is not set');
        throw new Error('FIREBASE_PROJECT_ID environment variable is required');
      }
      
      if (!process.env.FIREBASE_CLIENT_EMAIL) {
        console.error('[FIREBASE] FIREBASE_CLIENT_EMAIL is not set');
        throw new Error('FIREBASE_CLIENT_EMAIL environment variable is required');
      }
      
      if (!process.env.FIREBASE_PRIVATE_KEY) {
        console.error('[FIREBASE] FIREBASE_PRIVATE_KEY is not set');
        throw new Error('FIREBASE_PRIVATE_KEY environment variable is required');
      }

      if (!admin.apps.length) {
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
        console.log('[FIREBASE] Firebase Admin initialized successfully');
      } else {
        this.firebaseApp = admin.apps[0] as admin.app.App;
        console.log('[FIREBASE] Using existing Firebase Admin instance');
      }
    } catch (error: any) {
      console.error('[FIREBASE] Error initializing Firebase Admin:', error.message);
      throw error;
    }
  }

  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      if (!token) {
        throw new Error('Token is required');
      }
      const decoded = await admin.auth().verifyIdToken(token);
      console.log('[FIREBASE] Token verified successfully for UID:', decoded.uid);
      return decoded;
    } catch (error: any) {
      console.error('[FIREBASE] Token verification failed:', error.message);
      throw new Error(`Invalid token: ${error.message}`);
    }
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    try {
      if (!uid) {
        throw new Error('UID is required');
      }
      const user = await admin.auth().getUser(uid);
      console.log('[FIREBASE] User fetched:', user.email);
      return user;
    } catch (error: any) {
      console.error('[FIREBASE] Error fetching user:', error.message);
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }
}

