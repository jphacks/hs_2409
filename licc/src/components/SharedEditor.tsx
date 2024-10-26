import { useEffect, useState } from "react";
import { db } from "../FirebaseConfig";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { Editor } from "@monaco-editor/react";

const SharedEditor = (prop: {channelName: string}) => {
  const [code, setCode] = useState("");
  const docRef = doc(db, "codes", prop.channelName); // codesコレクションにチャンネル名のドキュメントを作成
  
  useEffect(() => {
    // Firestoreのドキュメントをリアルタイムで監視
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setCode(doc.data().text);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCodeChange = async (newCode: string | undefined) => {
    if (newCode) {
        setCode(newCode);
        await setDoc(docRef, {Text: newCode});
    }
  }

  return (
    <div id="editor">
      <Editor
        language="c"
        value={code}
        onChange={handleCodeChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default SharedEditor;
