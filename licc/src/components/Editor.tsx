import React, { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { WebsocketProvider } from 'y-websocket';
import { saveAs } from 'file-saver';
import { Editor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

const EditorComponent = () => {
  const editorRef = useRef(null);
  const ydocRef = useRef(null);
  const providerRef = useRef(null);
  const bindingRef = useRef(null);

  useEffect(() => {
    ydocRef.current = new Y.Doc();

    providerRef.current = new WebsocketProvider('ws://localhost:1234', 'monaco-demo', ydocRef.current);

    const yText = ydocRef.current.getText('monaco');

    const awareness = providerRef.current.awareness;
    awareness.setLocalStateField('user', {
      name: 'ユーザー' + Math.floor(Math.random() * 100),
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    });

    return () => {
      if (bindingRef.current) bindingRef.current.destroy();
      if (providerRef.current) providerRef.current.disconnect();
      if (ydocRef.current) ydocRef.current.destroy();
    };
  }, []);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;

    const yText = ydocRef.current.getText('monaco');
    const model = editor.getModel();

    if (model) {
      bindingRef.current = new MonacoBinding(
        yText,
        model,
        new Set([editor]),
        providerRef.current.awareness,
        monaco
      );
    }
  };

  return (
    <div id="editor" style={{ width: '100%', height: '100vh' }}>
      <Editor
        language="javascript"
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
        onMount={handleEditorMount}
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