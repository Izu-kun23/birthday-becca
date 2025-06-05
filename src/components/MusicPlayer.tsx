import React, { useState, useRef, useEffect } from 'react';
import ryanOfeiSong from '../assets/ryan_ofei.mp3';

const DEFAULT_SONG_TITLE = 'Birthday Track';

const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);  // default to true since we’ll autoplay
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    // Attempt autoplay on mount
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(err => {
        console.warn('Autoplay might be blocked:', err);
        setIsPlaying(false); // revert to not playing if blocked
      });

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setProgress(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="bg-black p-2 rounded shadow-sm text-white w-full max-w-xs mx-auto">
      <h3 className="text-sm font-semibold text-center mb-1">
        {DEFAULT_SONG_TITLE}
      </h3>
      <audio ref={audioRef} src={ryanOfeiSong} preload="metadata" />
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlayPause}
          className={`px-2 py-1 rounded text-xs ${
            isPlaying
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-gray-500 hover:bg-gray-400'
          }`}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <input
          type="range"
          min="0"
          max={duration}
          value={progress}
          step="0.1"
          onChange={handleSeek}
          className="flex-grow"
        />
        <span className="text-xs">
          {formatTime(progress)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default MusicPlayer;