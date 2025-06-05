import React, { useState, useEffect } from 'react';
import {
  uploadVideoAndSaveWish,
  fetchVideoWishes,
  deleteVideoWish,
} from '../../api/formController';

interface VideoWish {
  id: string;
  name: string;
  fileUrl: string;
  createdAt: Date | null;
}

const VideosPage: React.FC = () => {
  const [name, setName] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [videos, setVideos] = useState<VideoWish[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New state for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<VideoWish | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const fetchedVideos = await fetchVideoWishes();
        setVideos(fetchedVideos);
      } catch (err) {
        setError('Failed to load videos.');
        console.error(err);
      }
    };
    loadVideos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!name.trim()) {
      alert('Please enter a name.');
      return;
    }
    if (!videoFile) {
      alert('Please select a video file.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const newWishId = await uploadVideoAndSaveWish(name, videoFile);
      const newVideo: VideoWish = {
        id: newWishId,
        name,
        fileUrl: URL.createObjectURL(videoFile),
        createdAt: new Date(),
      };
      // Append the new video at the end
      setVideos((prev) => [...prev, newVideo]);
      setName('');
      setVideoFile(null);
      (document.getElementById('video-upload-input') as HTMLInputElement).value = '';
    } catch (err) {
      setError('Upload failed, please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // Confirm delete action inside modal
  const confirmDelete = async () => {
    if (!videoToDelete) return;
    setDeletingId(videoToDelete.id);
    setError(null);
    setModalOpen(false);

    try {
      await deleteVideoWish(videoToDelete.id, videoToDelete.fileUrl);
      setVideos((prev) => prev.filter((v) => v.id !== videoToDelete.id));
    } catch (err) {
      setError('Failed to delete the video wish.');
      console.error(err);
    } finally {
      setDeletingId(null);
      setVideoToDelete(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setModalOpen(false);
    setVideoToDelete(null);
  };

  return (
    <main className="max-w-xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md relative">
      <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
        Upload a Birthday Video Wish
      </h2>

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={uploading || deletingId !== null || modalOpen}
        aria-label="Enter your name"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 text-gray-900"
      />

      <input
        id="video-upload-input"
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        disabled={uploading || deletingId !== null || modalOpen}
        aria-label="Choose a video file"
        className="block w-full text-gray-700 mb-6"
      />

      <button
        onClick={handleUpload}
        disabled={uploading || deletingId !== null || modalOpen}
        aria-live="polite"
        className={`w-full py-3 rounded-lg font-semibold text-white transition-colors duration-200 ${
          uploading
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload Video'}
      </button>

      {error && (
        <p className="mt-4 text-center text-red-600 font-semibold" role="alert">
          {error}
        </p>
      )}

      <hr className="my-10 border-gray-300" />

      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Uploaded Videos</h3>

      {videos.length === 0 && (
        <p className="text-center text-gray-600">No videos uploaded yet.</p>
      )}

      <ul className="space-y-8">
        {videos
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateA - dateB; // oldest first
          })
          .map(({ id, name, fileUrl, createdAt }) => (
            <li
              key={id}
              className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow relative"
            >
              <strong className="block text-lg text-gray-800 mb-3">{name}</strong>
              <video
                src={fileUrl}
                controls
                preload="metadata"
                className="w-full rounded-lg max-h-72 bg-black"
              />
              <div className="mt-2 text-sm italic text-gray-500 text-right">
                {createdAt ? new Date(createdAt).toLocaleString() : ''}
              </div>
            </li>
          ))}
      </ul>

      {/* Modal */}
      {modalOpen && videoToDelete && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
            <h2
              id="modal-title"
              className="text-lg font-semibold mb-4 text-gray-900"
            >
              Confirm Delete
            </h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete the video wish from <strong>{videoToDelete.name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                autoFocus
              >
                Confirm
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default VideosPage;