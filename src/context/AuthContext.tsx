import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { auth, db, googleProvider, microsoftProvider, isOnline } from '../lib/firebase';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithMicrosoft: () => Promise<void>;
    signInWithTestUser: () => Promise<void>;
    signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Test user data
const TEST_USER_DATA = {
    uid: 'test-fatih-terim-001',
    email: 'fatih.terim@test.com',
    displayName: 'Fatih Terim',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
    emailVerified: true,
    isAnonymous: false,
    metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString()
    },
    providerData: [{
        providerId: 'test.com',
        uid: 'test-fatih-terim-001',
        displayName: 'Fatih Terim',
        email: 'fatih.terim@test.com',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format'
    }],
    refreshToken: 'test-refresh-token',
    tenantId: null
};

const TECH_NICH_WORKSPACE_ID = 'tech-nich-workspace-001';

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

        // Check for persistent test user login
        const savedTestUser = localStorage.getItem('test-user-session');
        if (savedTestUser) {
            console.log('Found saved test user session');
            setCurrentUser(TEST_USER_DATA as User);
            setLoading(false);
            return;
        }

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

    const signInWithTestUser = async () => {
        try {
            console.log('Signing in with test user (Fatih Terim)...');
            setLoading(true);

            // Save to localStorage for persistence
            localStorage.setItem('test-user-session', 'true');
            localStorage.setItem('test-user-workspace', TECH_NICH_WORKSPACE_ID);

            // Create user profile in Firestore if it doesn't exist
            if (isOnline) {
                try {
                    const userRef = doc(db, 'users', TEST_USER_DATA.uid);
                    const userDoc = await getDoc(userRef);

                    if (!userDoc.exists()) {
                        await setDoc(userRef, {
                            uid: TEST_USER_DATA.uid,
                            displayName: TEST_USER_DATA.displayName,
                            email: TEST_USER_DATA.email,
                            photoURL: TEST_USER_DATA.photoURL,
                            createdAt: new Date().toISOString(),
                        });
                        console.log('Test user profile created');
                    }

                    // Create or update Tech Nich workspace
                    const workspaceRef = doc(db, 'workspaces', TECH_NICH_WORKSPACE_ID);
                    const workspaceDoc = await getDoc(workspaceRef);

                    if (!workspaceDoc.exists()) {
                        await setDoc(workspaceRef, {
                            name: 'Tech Nich',
                            description: 'Development and innovation workspace for Tech Nich team',
                            ownerId: TEST_USER_DATA.uid,
                            members: {
                                [TEST_USER_DATA.uid]: 'Admin'
                            },
                            sprintGoal: 'Deliver high-quality features and improve user experience',
                            kanbanColumns: [
                                { id: 'todo', name: 'Todo', order: 0 },
                                { id: 'in-progress', name: 'In Progress', order: 1 },
                                { id: 'blocked', name: 'Blocked', order: 2 },
                                { id: 'dev-done', name: 'Dev Done', order: 3 },
                                { id: 'test-ready', name: 'Test Ready', order: 4 },
                                { id: 'testing', name: 'Testing', order: 5 },
                                { id: 'done', name: 'Done', order: 6 }
                            ],
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        });
                        console.log('Tech Nich workspace created');

                        // Add sample tasks for testing
                        const sampleTasks = [
                            {
                                title: 'Kullanıcı giriş sistemi geliştirme',
                                description: 'OAuth entegrasyonu ve güvenlik özelliklerini içeren kullanıcı giriş sistemi',
                                status: 'In Progress',
                                assignee: {
                                    id: TEST_USER_DATA.uid,
                                    name: TEST_USER_DATA.displayName,
                                    email: TEST_USER_DATA.email,
                                    avatarUrl: TEST_USER_DATA.photoURL
                                },
                                workspaceId: TECH_NICH_WORKSPACE_ID,
                                sprintId: 'sprint-001',
                                storyPoints: 8,
                                dependencies: [],
                                team: 'Backend',
                                tags: ['authentication', 'security', 'backend'],
                                priority: 'High',
                                createdAt: new Date().toISOString()
                            },
                            {
                                title: 'Responsive dashboard tasarımı',
                                description: 'Mobil ve desktop için optimize edilmiş kullanıcı dashboard arayüzü',
                                status: 'Todo',
                                assignee: {
                                    id: TEST_USER_DATA.uid,
                                    name: TEST_USER_DATA.displayName,
                                    email: TEST_USER_DATA.email,
                                    avatarUrl: TEST_USER_DATA.photoURL
                                },
                                workspaceId: TECH_NICH_WORKSPACE_ID,
                                sprintId: 'sprint-001',
                                storyPoints: 5,
                                dependencies: [],
                                team: 'Frontend',
                                tags: ['ui', 'responsive', 'dashboard'],
                                priority: 'Medium',
                                createdAt: new Date().toISOString()
                            },
                            {
                                title: 'API dokümantasyonu hazırlama',
                                description: 'REST API endpoints için kapsamlı dokümantasyon ve örnek kullanımlar',
                                status: 'Done',
                                assignee: {
                                    id: TEST_USER_DATA.uid,
                                    name: TEST_USER_DATA.displayName,
                                    email: TEST_USER_DATA.email,
                                    avatarUrl: TEST_USER_DATA.photoURL
                                },
                                workspaceId: TECH_NICH_WORKSPACE_ID,
                                sprintId: 'sprint-001',
                                storyPoints: 3,
                                dependencies: [],
                                team: 'Backend',
                                tags: ['documentation', 'api'],
                                priority: 'Low',
                                completedAt: new Date(Date.now() - 86400000).toISOString(),
                                createdAt: new Date(Date.now() - 172800000).toISOString()
                            },
                            {
                                title: 'Unit test coverage artırma',
                                description: 'Kritik modüller için unit test coverage %90 üzerine çıkarma',
                                status: 'Blocked',
                                assignee: {
                                    id: TEST_USER_DATA.uid,
                                    name: TEST_USER_DATA.displayName,
                                    email: TEST_USER_DATA.email,
                                    avatarUrl: TEST_USER_DATA.photoURL
                                },
                                workspaceId: TECH_NICH_WORKSPACE_ID,
                                sprintId: 'sprint-001',
                                storyPoints: 13,
                                dependencies: [],
                                team: 'Backend',
                                tags: ['testing', 'quality'],
                                priority: 'High',
                                isBlocked: true,
                                blockerCategory: 'Technical Dependency',
                                blockerDescription: 'Test framework setup gerekiyor',
                                createdAt: new Date().toISOString()
                            }
                        ];

                        try {
                            const tasksRef = collection(db, 'workspaces', TECH_NICH_WORKSPACE_ID, 'tasks');
                            for (const task of sampleTasks) {
                                await addDoc(tasksRef, task);
                            }
                            console.log('Sample tasks added to Tech Nich workspace');
                        } catch (error) {
                            console.error('Error adding sample tasks:', error);
                        }
                    } else {
                        // Update members to include test user
                        const currentData = workspaceDoc.data();
                        if (!currentData.members || !currentData.members[TEST_USER_DATA.uid]) {
                            await setDoc(workspaceRef, {
                                ...currentData,
                                members: {
                                    ...currentData.members,
                                    [TEST_USER_DATA.uid]: 'Admin'
                                },
                                updatedAt: new Date().toISOString()
                            }, { merge: true });
                            console.log('Test user added to Tech Nich workspace');
                        }
                    }
                } catch (error) {
                    console.error('Error setting up test user data:', error);
                }
            }

            setCurrentUser(TEST_USER_DATA as User);
            console.log('Test user sign-in successful');
        } catch (error) {
            console.error('Test user sign-in error', error);
        } finally {
            setLoading(false);
        }
    };

    const signOutUser = async () => {
        console.log('Signing out user...');

        // Clear test user session
        localStorage.removeItem('test-user-session');
        localStorage.removeItem('test-user-workspace');

        if (currentUser && currentUser.uid !== TEST_USER_DATA.uid) {
            await signOut(auth);
        }

        setCurrentUser(null);
    };

    const value = {
        currentUser,
        loading,
        signInWithGoogle,
        signInWithMicrosoft,
        signInWithTestUser,
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
