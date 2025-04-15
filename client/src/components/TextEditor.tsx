import { useState, useEffect, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { SAVE_INTERVAL_MS } from '../constants';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { createQuillEditor } from "@/toolbar/createQuill";
import { useAdmin } from '@/context/AdminContext';

export const TextEditor = () => {
  const { isAdmin } = useAdmin();
  const [socket, setSocket] = useState<Socket>();
  const [quill, setQuill] = useState<Quill>();
  const { id: documentId } = useParams();

  // 소켓 연결
  useEffect(() => {
    const skt = io(import.meta.env.VITE_SERVER_URL);
    setSocket(skt);
    return () => {
      skt.disconnect();
    };
  }, []);

  // 에디터 생성
  const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
    if (!wrapper) return;
    const quillInstance = createQuillEditor(wrapper, isAdmin);
    setQuill(quillInstance);
  }, [isAdmin]);

  // 입력 시 서버로 전송
  useEffect(() => {
    if (!socket || !quill) return;

    // @ts-ignore
    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  // 다른 클라이언트의 변경 수신
  useEffect(() => {
    if (!socket || !quill) return;

    // @ts-ignore
    const handler = (delta) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handler);
    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  // 문서 로드
  useEffect(() => {
    if (!socket || !quill) return;

    socket.once("load-document", (document) => {
      // 1. 기존 내용 제거
      quill.setContents({ ops: [] }); // 깔끔하게 초기화
      // 2. 테이블 등 포맷 유지하면서 로드
      quill.updateContents(document, Quill.sources.SILENT);
      // 3. 선택 위치 이동 (선택)
      quill.setSelection(quill.getLength(), Quill.sources.SILENT);
      quill.enable();
    });

    const documentName = localStorage.getItem(`document-name-for-${documentId}`) || "Untitled";
    socket.emit("get-document", { documentId, documentName });
  }, [socket, quill, documentId]);

  // 자동 저장
  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      const delta = quill.getContents();
      socket.emit("save-document", delta);
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      localStorage.clear();
    };
  }, [socket, quill]);

  return <div className="editorContainer" ref={wrapperRef} />;
};
