import { useState } from "react";
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


export const LiveVideo = () => {

  const appId = 'fd57f12beae042569095bfc0ecc9f6b4'
  // const agoraEngine = useRTCClient( AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })); // Initialize Agora Client
  const { channelName } = useParams() //pull the channel name from the param

  // set the connection state
  const [activeConnection, setActiveConnection] = useState(true);

  // track the mic/video state - Turn on Mic and Camera On
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);

  // get local video and mic tracks
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  // to leave the call
  const navigate = useNavigate()

  // Join the channel
  useJoin(
    {
      appid: appId,
      channel: channelName!,
      token: null,
    },
    activeConnection,
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  //remote users
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // play the remote user audio tracks
  audioTracks.forEach((track) => track.play());


  return (
    <>
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
    </>
  )
}