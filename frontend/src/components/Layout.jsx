import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import { listDocumentsWithMeta } from '../utils/documentStore';

export default function Layout() {
  const [footerMessage, setFooterMessage] = useState('Prêt');
  const [documents, setDocuments] = useState(() => listDocumentsWithMeta());
  const [saveHandler, setSaveHandler] = useState(null);
  const [selectIdHandler, setSelectIdHandler] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState('');

  const refreshDocumentIds = useCallback(() => {
    setDocuments(listDocumentsWithMeta());
  }, []);

  const handleSaveClick = useCallback(() => {
    if (saveHandler) {
      saveHandler();
      refreshDocumentIds();
    }
  }, [saveHandler, refreshDocumentIds]);

  const handleSelectId = useCallback((id) => {
    setSelectedDocId(id);
    if (selectIdHandler && id) {
      selectIdHandler(id);
    }
  }, [selectIdHandler]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        documents={documents}
        selectedDocId={selectedDocId}
        onSave={handleSaveClick}
        onSelectId={handleSelectId}
      />
      <Outlet
        context={{
          setFooterMessage,
          registerSaveHandler: setSaveHandler,
          registerSelectIdHandler: setSelectIdHandler,
          refreshDocumentIds,
          setSelectedDocId,
        }}
      />
      <Footer message={footerMessage} />
    </div>
  );
}
