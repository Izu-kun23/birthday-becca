import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp, query, orderBy, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const storage = getStorage();

export const uploadFile = async (file: File): Promise<string> => {
  const folder = file.type.startsWith('image/')
    ? 'images'
    : file.type.startsWith('video/')
    ? 'videos'
    : 'files';

  const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

export const saveBirthdayWish = async (
  name: string,
  message: string,
  fileUrl?: string  // generic file URL, can be image, video, or any file
) => {
  try {
    const docRef = await addDoc(collection(db, 'wishes'), {
      name,
      message,
      fileUrl: fileUrl || null,  // save null if no file
      createdAt: Timestamp.now(),
    });
    console.log('Wish saved successfully with ID:', docRef.id);
    return docRef.id;  // return the generated document ID
  } catch (error) {
    console.error('Error saving wish:', error);
    throw error;
  }
};

export const fetchBirthdayWishes = async () => {
  const wishesCollection = collection(db, 'wishes');
  const q = query(wishesCollection, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  const wishes = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      message: data.message,
      fileUrl: data.fileUrl || null,  // generic fileUrl instead of videoUrl
      createdAt: data.createdAt?.toDate?.() || null,
    };
  });

  return wishes;
};

export const editBirthdayWish = async (id: string, updatedData: { name?: string; message?: string; videoUrl?: string }) => {
  try {
    const wishDocRef = doc(db, 'wishes', id);
    await updateDoc(wishDocRef, {
      ...updatedData,
    });
    console.log('Wish updated successfully:', id);
  } catch (error) {
    console.error('Error updating wish:', error);
    throw error;
  }
};

export const deleteBirthdayWish = async (id: string) => {
  try {
    const wishDocRef = doc(db, 'wishes', id);
    await deleteDoc(wishDocRef);
    console.log('Wish deleted successfully:', id);
  } catch (error) {
    console.error('Error deleting wish:', error);
    throw error;
  }
};

export const uploadVideoAndSaveWish = async (
  name: string,
  videoFile: File
) => {
  try {
    const storageRef = ref(storage, `videos/${Date.now()}_${videoFile.name}`);
    await uploadBytes(storageRef, videoFile);
    const videoUrl = await getDownloadURL(storageRef);

    const docRef = await addDoc(collection(db, 'wishes'), {
      name,
      fileUrl: videoUrl,
      createdAt: Timestamp.now(),
    });

    console.log('Wish with video saved successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error uploading video and saving wish:', error);
    throw error;
  }
};

export const fetchVideoWishes = async () => {
  try {
    const wishesCollection = collection(db, 'wishes');

    // Query wishes where fileUrl exists and looks like a video URL (optional)
    // Since Firestore doesn’t support querying by string content directly,
    // we'll fetch all and filter after or just fetch all.

    // Here fetching all ordered by createdAt desc
    const q = query(wishesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    // Filter wishes that have a fileUrl (video) - you can add extra checks if needed
    const videoWishes = querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          fileUrl: data.fileUrl || null,
          createdAt: data.createdAt?.toDate?.() || null,
        };
      })
      .filter(wish => wish.fileUrl); // keep only wishes with fileUrl

    return videoWishes;
  } catch (error) {
    console.error('Error fetching video wishes:', error);
    throw error;
  }
};

export const deleteVideoWish = async (id: string, fileUrl: string) => {
  try {
    // Extract the storage file path from the fileUrl
    // Example URL format:
    // https://firebasestorage.googleapis.com/v0/b/{bucket}/o/videos%2Ffilename.mp4?alt=media&token=...
    const startIndex = fileUrl.indexOf('/o/');
    if (startIndex === -1) {
      throw new Error('Invalid Firebase Storage URL');
    }
    const endIndex = fileUrl.indexOf('?');
    const fullPathEncoded = fileUrl.substring(startIndex + 3, endIndex === -1 ? undefined : endIndex);
    const fullPath = decodeURIComponent(fullPathEncoded); // e.g. videos/filename.mp4

    // Create a reference to the file in storage
    const videoRef = ref(storage, fullPath);

    // Delete the video file from Firebase Storage
    await deleteObject(videoRef);
    console.log('Video file deleted from storage:', fullPath);

    // Delete the Firestore document
    await deleteDoc(doc(db, 'wishes', id));
    console.log('Wish document deleted from Firestore:', id);

  } catch (error) {
    console.error('Error deleting video wish:', error);
    throw error;
  }
};