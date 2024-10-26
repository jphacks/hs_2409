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
import { Editor } from "@monaco-editor/react";

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

  // エディターのコード状態を管理
  const [code, setCode] = useState("// ここにコードを入力");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 左側：Monaco Editor */}
      <div id="editor">
        <Editor
          language="c"
          value={code}
          onChange={(newValue) => setCode(newValue || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
          width="100%"
          height="100%"
        />
      </div>

      {/* 右側：ビデオコンポーネント */}
            <div id='videoFrame'>
        <div id='remoteVideoGrid'>
          <div className="remote-video-container">
            <LocalUser
              audioTrack={localMicrophoneTrack}
              videoTrack={localCameraTrack}
              cameraOn={cameraOn}
              micOn={micOn}
              playAudio={micOn}
              playVideo={cameraOn}
              className=''
            />
            {/* media-controls toolbar component - UI controling mic, camera, & connection state  */}
            <div id="controlsToolbar">
              <div id="mediaControls">
                <button className="btn" onClick={() => setMic(a => !a)}>
                  Mic
                </button>
                <button className="btn" onClick={() => setCamera(a => !a)}>
                  Camera
                </button>
                <button id="endConnection"
                  onClick={() => {
                    setActiveConnection(false)
                    navigate('/')
                  }}> Disconnect
                </button>
              </div>
            </div>
          </div>
          <div>

          </div>
          { 
            // Initialize each remote stream using RemoteUser component
            remoteUsers.map((user) => (
              <div key={user.uid} className="remote-video-container">
                <RemoteUser user={user} /> 
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};