import { useState } from 'react';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [education, setEducation] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('Digital literacy, Communication');
  const [interests, setInterests] = useState('Artificial Intelligence, Software Development');
  const [message, setMessage] = useState('');

  const initials = name.trim()
    ? name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    : 'GU';

  function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('Your changes are currently held in this page session. Account and database saving are not connected yet.');
  }

  return (
    <main className="edu-page studio-page">
      <section className="edu-page-hero">
        <span className="studio-eyebrow">YOUR LEARNING IDENTITY</span>
        <h1>My Profile</h1>
        <p>Build your learner profile, describe your interests and organise your professional skills.</p>
      </section>

      <section className="profile-summary studio-panel">
        <div className="profile-avatar-large" aria-label={`Profile initials ${initials}`}>{initials}</div>
        <div className="profile-summary-copy">
          <span className="studio-eyebrow">LEARNER PROFILE</span>
          <h2>{name.trim() || 'Your name'}</h2>
          <p>{headline.trim() || 'Add a headline describing your learning or professional interests.'}</p>
          <span className="profile-country">{country}</span>
        </div>
        <span className="studio-count">Preview profile</span>
      </section>

      <form className="studio-panel profile-form" onSubmit={saveProfile}>
        <div className="edu-section-heading">
          <div>
            <span className="studio-eyebrow">PERSONAL INFORMATION</span>
            <h2>Profile details</h2>
          </div>
        </div>

        <div className="profile-fields-grid">
          <label>
            Full name
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your full name" />
          </label>
          <label>
            Professional or learner headline
            <input value={headline} onChange={(event) => setHeadline(event.target.value)} placeholder="e.g. Software developer and lifelong learner" />
          </label>
          <label>
            Country
            <select value={country} onChange={(event) => setCountry(event.target.value)}>
              <option>Nigeria</option>
              <option>Ghana</option>
              <option>United Kingdom</option>
              <option>United States</option>
              <option>Kenya</option>
              <option>South Africa</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Education or qualification
            <input value={education} onChange={(event) => setEducation(event.target.value)} placeholder="Your education or current programme" />
          </label>
        </div>

        <label className="profile-full-field">
          About me
          <textarea rows={5} value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Tell the GoNix learning community about yourself, your experience and your goals." />
        </label>

        <label className="profile-full-field">
          Skills
          <textarea rows={3} value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="Separate skills with commas" />
        </label>

        <label className="profile-full-field">
          Learning interests
          <textarea rows={3} value={interests} onChange={(event) => setInterests(event.target.value)} placeholder="What would you like to learn?" />
        </label>

        <button className="studio-action-button" type="submit">Save profile changes</button>
        {message && <p className="studio-status" role="status">{message}</p>}
      </form>

      <p className="studio-demo-notice">
        Profile editing preview only. Authentication, profile photo upload, account identity,
        privacy controls and permanent profile storage must be connected before this becomes
        your official account profile. Do not enter sensitive personal information here yet.
      </p>
    </main>
  );
}
