import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, microsoftProvider } from '../lib/firebase';

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
        const userRef = doc(db, 'users', user.uid);
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
            } catch (error) {
                console.error("Error creating user document:", error);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await createUserProfileDocument(user);
            }
            setCurrentUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Google sign-in error", error);
            setLoading(false);
        }
    };

    const signInWithMicrosoft = async () => {
        try {
            setLoading(true);
            await signInWithPopup(auth, microsoftProvider);
        } catch (error) {
            console.error("Microsoft sign-in error", error);
            setLoading(false);
        }
    };

    const signOutUser = async () => {
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

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
