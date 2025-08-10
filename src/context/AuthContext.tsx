import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, microsoftProvider, isOnline } from '../lib/firebase';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithMicrosoft: () => Promise<void>;
    signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const createUserProfileDocument = async (user: User) => {
        if (!user) return;
        
        // Check if we're online before trying to access Firestore
        if (!isOnline) {
            console.log('Offline mode: Skipping user profile creation');
            return;
        }
        
        console.log('Creating user profile for:', user.uid);
        const userRef = doc(db, 'users', user.uid);
        
        try {
            const snapshot = await getDoc(userRef);

            if (!snapshot.exists()) {
                const { displayName, email, photoURL, uid } = user;
                try {
                    await setDoc(userRef, {
                        uid,
                        displayName,
                        email,
                        photoURL,
                        createdAt: new Date().toISOString(),
                    });
                    console.log('User profile created successfully');
                } catch (error) {
                    console.error("Error creating user document:", error);
                }
            } else {
                console.log('User profile already exists');
            }
        } catch (error) {
            console.error("Error accessing Firestore:", error);
            // If Firestore is not available, continue without creating profile
            console.log('Continuing without user profile creation');
        }
    };

    useEffect(() => {
        console.log('AuthContext: Setting up auth state listener');
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('Auth state changed:', user ? `User: ${user.uid}` : 'No user');
            if (user) {
                await createUserProfileDocument(user);
            }
            setCurrentUser(user);
            setLoading(false);
            console.log('AuthContext: Loading set to false');
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            console.log('Attempting Google sign-in...');
            setLoading(true);
            await signInWithPopup(auth, googleProvider);
            console.log('Google sign-in successful');
        } catch (error) {
            console.error("Google sign-in error", error);
            setLoading(false);
        }
    };

    const signInWithMicrosoft = async () => {
        try {
            console.log('Attempting Microsoft sign-in...');
            setLoading(true);
            await signInWithPopup(auth, microsoftProvider);
            console.log('Microsoft sign-in successful');
        } catch (error) {
            console.error("Microsoft sign-in error", error);
            setLoading(false);
        }
    };

    const signOutUser = async () => {
        console.log('Signing out user...');
        await signOut(auth);
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        loading,
        signInWithGoogle,
        signInWithMicrosoft,
        signOutUser,
    };

    console.log('AuthContext: Current state:', { currentUser: currentUser?.uid, loading, isOnline });

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
