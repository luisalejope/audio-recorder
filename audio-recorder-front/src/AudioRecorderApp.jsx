import { useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";

export const AudioRecorderApp = () => {
  const [audioUrl, setAudioUrl] = useState(null);

  const sendAudioToBackend = async (blob) => {
    const formData = new FormData();
    formData.append("audio", blob, "audio.wav");

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } else {
      console.error("Failed to upload and receive audio");
    }
  };

  return (
    <div className="audio-recorder">
      <h2>Audio Recorder</h2>
      <ReactMediaRecorder
        audio
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <div>
            <p>Status: {status}</p>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            <audio src={mediaBlobUrl} controls />
            {mediaBlobUrl && (
              <button
                onClick={async () => {
                  const blob = await fetch(mediaBlobUrl).then((r) => r.blob());
                  sendAudioToBackend(blob);
                }}
              >
                Send to Backend
              </button>
            )}
            {audioUrl && (
              <div className="received-audio">
                <h3>Received Audio:</h3>
                <audio src={audioUrl} controls />
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}
