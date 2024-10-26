import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import SharedEditor from "./SharedEditor";

export const LiveVideo = () => {
  const appId = 'fd57f12beae042569095bfc0ecc9f6b4';
  const { channelName } = useParams();

  const [activeConnection, setActiveConnection] = useState(true);

  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  const navigate = useNavigate();

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
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 左側：Monaco Editor */}
      <SharedEditor channelName={channelName!} />

      {/* 右側：ビデオコンポーネント */}
      <div style={{ display: "flex", height: "100vh" }}>
        <div id="remoteVideoGrid" style={{ flex: 0 }}>
          {remoteUsers.map((user) => (
            <div key={user.uid} className="remote-video-container">
              <RemoteUser user={user} />
            </div>
          ))}
        </div>
        <div id="localVideo" style={{ flexShrink: 0 }}>
          <LocalUser
            audioTrack={localMicrophoneTrack}
            videoTrack={localCameraTrack}
            cameraOn={cameraOn}
            micOn={micOn}
            playAudio={micOn}
            playVideo={cameraOn}
          />
          {/* メディアコントロール */}
          <div id="controlsToolbar">
            <div id="mediaControls">
              <button className="btn" onClick={() => setMic((prev) => !prev)}>
                {micOn ? "マイクオフ" : "マイクオン"}
              </button>
              <button className="btn" onClick={() => setCamera((prev) => !prev)}>
                {cameraOn ? "カメラオフ" : "カメラオン"}
              </button>
            </div>
            <button
              id="endConnection"
              onClick={() => {
                setActiveConnection(false);
                navigate("/");
              }}
            >
              切断
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};