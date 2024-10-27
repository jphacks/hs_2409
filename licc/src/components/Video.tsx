// VideoComponent.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
} from 'agora-rtc-react';

const VideoComponent = () => {
  const appId = 'fd57f12beae042569095bfc0ecc9f6b4';
  const { channelName } = useParams();
  const navigate = useNavigate();

  const [activeConnection, setActiveConnection] = useState(true);
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  useJoin(
    {
      appid: appId,
      channel: channelName!,
      token: null,
    },
    activeConnection
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  audioTracks.forEach((track) => track.play());

  return (
    <div id="videoFrame">
      <div id="remoteVideoGrid">
        <div className="remote-video-container">
          <LocalUser
            audioTrack={localMicrophoneTrack}
            videoTrack={localCameraTrack}
            cameraOn={cameraOn}
            micOn={micOn}
            playAudio={micOn}
            playVideo={cameraOn}
            className=""
          />
          {/* メディアコントロールツールバー */}
          <div id="controlsToolbar">
            <div id="mediaControls">
              <button className="btn" onClick={() => setMic((a) => !a)}>
                Mic
              </button>
              <button className="btn" onClick={() => setCamera((a) => !a)}>
                Camera
              </button>
              <button
                id="endConnection"
                onClick={() => {
                  setActiveConnection(false);
                  navigate('/');
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
        {/* リモートユーザーのビデオストリームを表示 */}
        {remoteUsers.map((user) => (
          <div key={user.uid} className="remote-video-container">
            <RemoteUser user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoComponent;