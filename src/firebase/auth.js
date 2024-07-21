// auth.js
import { app, auth } from './index'; // Adjust the path if necessary
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';

const db = getFirestore(app);

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                userName: user?.displayName,
                photoUrl: user?.photoURL,
                id: user.uid
            });
            return user
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData?.email; // Optional chaining in case customData is undefined
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
}

export const listenForAllUsers = (callback, id) => {
    const unsubscribe = onSnapshot(collection(db, "users"), (querySnapshot) => {
        const users = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(user => user.id !== id); // Exclude the user with the specified ID
        callback(users);
    }, (error) => {
        console.error("Error listening for user changes:", error);
    });
    return unsubscribe; // Return the unsubscribe function to allow stopping the listener when needed
};

export const createChat = async (data) => {
    try {
        const docRef = await addDoc(collection(db, "chats"), {
            ...data, createdAt: serverTimestamp()
        });
        const newDoc = await getDoc(docRef);
        return { chatId: newDoc.id, ...newDoc.data() }
    } catch (error) {
        console.log("Error creating chat", error);
    }
}

export const createConversation = async (chatId, senderId, reciverId, message) => {
    try {
        const docRef = await addDoc(collection(db, "chats", chatId, "chatHistory"), {
            senderId: senderId,
            reciverId: reciverId,
            message: message,
            createdAt: serverTimestamp()
        });
    } catch (error) { console.log("Error creating conversation", error) }
}

export const getUserChat = async (callback, user1ID, user1Email, user2ID, user2Email) => {
    const doc = collection(db, "chats")
    // const docRef = ref(doc)
    const q = query(doc, where(user1ID, "==", user1Email), where(user2ID, "==", user2Email))
    const querySnapshot = await getDocs(q);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const chat = querySnapshot.docs.map((doc) => ({
            chatId: doc.id,
            ...doc.data()
        }))[0]; // Get the first chat document
        callback(chat);
    }, (error) => {
        console.error("Error fetching user chat:", error);
    });
    return unsubscribe
}

export const listenChat = (callback, id) => {
    try {
        console.log(id, "this is id")
        const chatsRef = collection(db, "chats", id, "chatHistory");
        const q = query(chatsRef, orderBy("createdAt", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chats = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(user => user.id !== id); // Exclude the user with the specified ID
            callback(chats);
        }, (error) => {
            console.error("Error listening for user changes:", error);
        });

        return unsubscribe; // Return the unsubscribe function to allow stopping the listener when needed
    } catch (err) {
        console.log(err, "<<< this is error")
    }
};