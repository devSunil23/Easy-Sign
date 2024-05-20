import React from "react";
import { Route, Routes } from "react-router-dom";
import "./utilities/axios";

//pages
import Header from "./components/Header/Header";
import CompletedDocuments from "./pages/document/Completed";
import AwaitedDocuments from "./pages/document/Awaited";
import VoidedDocuments from "./pages/document/Voided";
import DraftDocuments from "./pages/document/Draft";
import TrashDocuments from "./pages/document/Trash";
import ReceivedDocuments from "./pages/document/Received";
import FormTemplate from "./pages/Template/FormTemplate";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { env } from "./utilities/function";
import OtherSigner from "./components/OtherSigner";
import PreviewDocuments from "./components/PreviewDocument/PreviewDocuments";
import Sign from "./pages/ESign/Sign";
import Overview from "./pages/ESign/OverView";
import Template from "./pages/Template";
import Documents from "./pages/document";

const App = () => {
  return (
    <>
      <GoogleOAuthProvider clientId={env("GOOGLE_CLIENT_ID")}>
        <Header>
          <Routes>
            <Route path="/" element={<Sign />} />
            <Route path="/otherSinger" element={<OtherSigner />} />
            <Route path="/documents" element={<Documents />} />
            <Route
              path="/documents/completed"
              element={<CompletedDocuments />}
            />
            <Route path="/documents/awaiting" element={<AwaitedDocuments />} />
            <Route path="/documents/preview" element={<PreviewDocuments />} />
            <Route path="/documents/voided" element={<VoidedDocuments />} />
            <Route path="/documents/draft" element={<DraftDocuments />} />
            <Route path="/documents/received" element={<ReceivedDocuments />} />
            <Route path="/documents/trash" element={<TrashDocuments />} />
            <Route path="/templates/manage" element={<Template />} />
            <Route path="/templates/new" element={<FormTemplate />} />
            <Route path="/templates/:id" element={<FormTemplate />} />
            <Route path="/overview" element={<Overview />} />
          </Routes>
        </Header>
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
