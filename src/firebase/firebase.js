"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '.';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from './index'
import { listenForAllUsers } from './auth';
const FirebaseContext = createContext();

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null);
    const [allUsers, setALlUsers] = useState(null)
    const [usersLoader, setAllUsersLoader] = useState(true)

    const auth = useAuth()

    const getUserData = async (uid) => {
        const userDoc = await getDoc(doc(db, "users", uid));
        setUser(userDoc.data());
        setLoading(false)
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                if (!firebaseUser?.uid) {
                    setLoading(false)
                    return
                }
                listenForAllUsers((users) => {
                    setALlUsers(users)
                    setAllUsersLoader(false)
                }, firebaseUser?.uid);
                getUserData(firebaseUser?.uid)
            });
            return () => unsubscribe();
        }
    }, [auth]);
    return (
        <FirebaseContext.Provider value={{ user, loading, allUsers, usersLoader }}>
            {children}
        </FirebaseContext.Provider>
    );
};
