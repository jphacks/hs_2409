import React, { useState, useEffect, useRef } from "react";
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

import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { WebsocketProvider } from "y-websocket";

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

  const editorRef = useRef(null);

  useEffect(() => {
    const ydoc = new Y.Doc();

    const provider = new WebsocketProvider(
      'wss://demos.yjs.dev',
      channelName,
      ydoc
    );

    const yText = ydoc.getText('monaco');

    if (editorRef.current) {
      const editor = editorRef.current;
      const monacoBinding = new MonacoBinding(
        yText,
        editor.getModel(),
        new Set([editor]),
        provider.awareness
      );

      // クリーンアップ
      return () => {
        provider.disconnect();
        ydoc.destroy();
      };
    }
  }, [channelName]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 左側：Monaco Editor */}
      <div id="editor" style={{ width: "50%" }}>
        <Editor
          language="javascript"
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
          onMount={handleEditorDidMount}
        />
      </div>

      {/* 右側：ビデオコンポーネント */}
      <div id='videoFrame' style={{ width: "50%" }}>
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
            {/* メディアコントロール */}
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
          {
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