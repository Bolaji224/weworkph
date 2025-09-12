import React, { useState } from "react";
import { Play } from "lucide-react";

interface VideoItem {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
  description?: string;
}

const VideoPlayer: React.FC<{ currentVideo: VideoItem | null }> = ({ currentVideo }) => {
  const [isPlaying] = useState(false);

  if (!currentVideo) {
    return (
      <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-white/70" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Select a video to start learning</h3>
          <p className="text-white/70">Choose any video from the course content to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Video Area */}
      <div className="relative bg-gray-900 aspect-video">
        <video
          src={currentVideo.videoUrl}
          controls
          autoPlay={isPlaying}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Video Info */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentVideo.title}</h2>
        <p className="text-gray-600 mb-4">
          {currentVideo.description ||
            "Learn the essential concepts and practical applications in this comprehensive video lesson."}
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
