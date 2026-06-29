/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEuF05tWTOyhbyrP5EmqTWwiUyBWKqi5k",
  authDomain: "perfect-vortex-7wjkk.firebaseapp.com",
  projectId: "perfect-vortex-7wjkk",
  storageBucket: "perfect-vortex-7wjkk.firebasestorage.app",
  messagingSenderId: "831823128458",
  appId: "1:831823128458:web:c2c1a00ce477eefe1f0a73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Firestore with specific Database ID from config
export const db = getFirestore(app, "ai-studio-lifeosaipersonal-49295947-6957-4818-8c11-13a7416144dd");
