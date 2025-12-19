// src/controllers/UserController.js
import { auth, db, storage } from '../config/firebase'; // Ayar dosyanız
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const UserController = {
  
  getUserData: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      
      const userDoc = await getDoc(doc(db, "users", user.uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      return null;
    }
  },

  updateProfile: async (data) => {
    try {
      const user = auth.currentUser;
      const userRef = doc(db, "users", user.uid);
      
      await updateDoc(userRef, {
        ...data, 
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  uploadCV: async (fileUri) => {
    try {
      const user = auth.currentUser;
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `cvs/${user.uid}/my_cv.pdf`);
      
      await uploadBytes(storageRef, blob);
      
      const downloadUrl = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "users", user.uid), {
        cvUrl: downloadUrl
      });

      return { success: true, url: downloadUrl };
    } catch (error) {
      console.error("CV Yükleme Hatası:", error);
      return { success: false, error: error.message };
    }
  }
};