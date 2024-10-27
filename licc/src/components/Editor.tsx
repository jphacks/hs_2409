// EditorComponent.jsx
import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { Editor } from '@monaco-editor/react';

const EditorComponent = () => {
  const [code, setCode] = useState('// ここにコードを入力');

  return (
    <div id="editor">
      <Editor
        language="c"
        value={code}
        onChange={(newValue) => setCode(newValue || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
        width="100%"
        height="100%"
      />
      <div id='fileControls'>
        <button className='btn'
            onClick={() => saveAs(new Blob([code] ,{type: "text/plain;charset=utf-8"}))}>
              ファイルを保存
        </button>
      </div>
    </div>
  );
};

export default EditorComponent;