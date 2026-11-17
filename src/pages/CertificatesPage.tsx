import { useState } from 'react';

const demoCertificates = [
  {
    id: 'DEMO-EDU-001',
    title: 'Introduction to Digital Skills',
    issuer: 'GoNix EduPlus Demonstration',
    date: 'Sample completion date',
    status: 'Preview only',
  },
  {
    id: 'DEMO-EDU-002',
    title: 'Foundations of Artificial Intelligence',
    issuer: 'GoNix EduPlus Demonstration',
    date: 'Sample completion date',
    status: 'Preview only',
  },
];

export default function CertificatesPage() {
  const [selected, setSelected] = useState(demoCertificates[0]);

  return (
    <main className="edu-page studio-page">
      <section className="edu-page-hero">
        <span className="studio-eyebrow">ACHIEVEMENTS • RECOGNITION • GROWTH</span>
        <h1>My Certificates</h1>
        <p>Review learning achievements and access certificate verification information.</p>
      </section>

      <section className="studio-stats">
        <article className="studio-stat"><span>Demo certificate previews</span><strong>{demoCertificates.length}</strong></article>
        <article className="studio-stat"><span>Officially issued here</span><strong>0</strong></article>
        <article className="studio-stat"><span>Verification service</span><strong>Pending</strong></article>
      </section>

      <div className="studio-layout-grid certificate-layout">
        <section className="studio-panel">
          <span className="studio-eyebrow">CERTIFICATE LIBRARY</span>
          <h2>Available previews</h2>
          <div className="studio-entry-list">
            {demoCertificates.map((certificate) => (
              <button
                className={`certificate-select ${selected.id === certificate.id ? 'active' : ''}`}
                key={certificate.id}
                onClick={() => setSelected(certificate)}
              >
                <strong>{certificate.title}</strong>
                <span>{certificate.status}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="studio-panel certificate-preview-panel">
          <span className="studio-eyebrow">PREVIEW</span>
          <div className="certificate-paper">
            <span className="certificate-mark">E+</span>
            <p className="certificate-overline">GONIX EDUPLUS</p>
            <h2>Certificate of Achievement</h2>
            <p className="certificate-small">This demonstration recognises a sample achievement in</p>
            <h3>{selected.title}</h3>
            <p className="certificate-small">Presented as a sample certificate layout</p>
            <div className="certificate-signature">
              <span>GoNix EduPlus</span>
              <span>{selected.id}</span>
            </div>
          </div>
          <p className="studio-helper">
            This is a design preview, not an issued qualification or proof of course completion.
          </p>
          <button className="studio-action-button" onClick={() => window.print()}>
            Print preview
          </button>
        </section>
      </div>

      <section className="studio-panel">
        <span className="studio-eyebrow">CERTIFICATE VERIFICATION</span>
        <h2>Verify a certificate</h2>
        <p>
          Official verification requires a connected certificate registry and a valid certificate ID.
          That service is not yet connected in this prototype.
        </p>
        <div className="studio-verification-placeholder">
          <strong>Verification service coming in a later integration stage</strong>
          <span>Certificate IDs shown on this page are demonstration identifiers only.</span>
        </div>
      </section>
    </main>
  );
}
