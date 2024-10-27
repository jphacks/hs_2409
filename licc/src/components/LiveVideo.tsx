// LiveVideo.jsx
import React from 'react';
import EditorComponent from './Editor';
import VideoComponent from './Video';

export const LiveVideo = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 左側：エディタコンポーネント */}
      <EditorComponent />
      {/* 右側：ビデオコンポーネント */}
      <VideoComponent />
    </div>
  );
};