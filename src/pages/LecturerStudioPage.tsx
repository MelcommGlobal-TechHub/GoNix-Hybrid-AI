import { useState } from 'react';
import { Link } from 'react-router-dom';

type LessonDraft = {
  id: number;
  title: string;
  course: string;
  description: string;
};

type VideoResource = {
  id: number;
  title: string;
  provider: string;
  url: string;
};

export default function LecturerStudioPage() {
  const [course, setCourse] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lessons, setLessons] = useState<LessonDraft[]>([]);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoProvider, setVideoProvider] = useState('YouTube');
  const [videoUrl, setVideoUrl] = useState('');
  const [videos, setVideos] = useState<VideoResource[]>([]);
  const [notice, setNotice] = useState('');

  function addLesson(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!course.trim() || !lessonTitle.trim()) {
      setNotice('Enter a course name and lesson title first.');
      return;
    }

    setLessons((current) => [
      ...current,
      {
        id: Date.now(),
        title: lessonTitle.trim(),
        course: course.trim(),
        description: description.trim(),
      },
    ]);

    setLessonTitle('');
    setDescription('');
    setNotice('Lesson draft added to this temporary workspace.');
  }

  function addVideo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!videoTitle.trim() || !videoUrl.trim()) {
      setNotice('Enter a video title and video URL first.');
      return;
    }

    try {
      const parsed = new URL(videoUrl);
      if (!['https:', 'http:'].includes(parsed.protocol)) {
        throw new Error('Unsupported URL');
      }
    } catch {
      setNotice('Please enter a valid video URL beginning with https:// or http://.');
      return;
    }

    setVideos((current) => [
      ...current,
      {
        id: Date.now(),
        title: videoTitle.trim(),
        provider: videoProvider,
        url: videoUrl.trim(),
      },
    ]);

    setVideoTitle('');
    setVideoUrl('');
    setNotice('Video resource added to this temporary workspace.');
  }

  const aiPrompt = [
    'Help me prepare teaching materials.',
    `Course: ${course || 'Not specified'}.`,
    `Lesson: ${lessonTitle || 'Not specified'}.`,
    description ? `Lesson description: ${description}` : '',
    'Suggest learning outcomes, a lesson outline and suitable assessment questions.',
  ].filter(Boolean).join('\n\n');

  return (
    <main className="edu-page studio-page">
      <section className="edu-page-hero">
        <span className="studio-eyebrow">TEACH • CREATE • ORGANISE</span>
        <h1>Lecturer Studio</h1>
        <p>
          Prepare lesson drafts, organise teaching resources and plan
          assessments for your courses.
        </p>
        <div className="studio-hero-actions">
          <Link className="edu-primary-link" to="/courses">View courses</Link>
          <Link
            className="studio-secondary-link"
            to="/hybrid-ai"
            state={{ sourceStudio: '/lecturer-studio', prompt: aiPrompt }}
          >
            Teaching assistance with AI →
          </Link>
        </div>
      </section>

      <section className="studio-stats" aria-label="Teaching workspace overview">
        <article className="studio-stat">
          <span>Lesson drafts</span>
          <strong>{lessons.length}</strong>
        </article>
        <article className="studio-stat">
          <span>Video resources</span>
          <strong>{videos.length}</strong>
        </article>
        <article className="studio-stat">
          <span>Workspace</span>
          <strong>Draft</strong>
        </article>
      </section>

      <div className="studio-layout-grid">
        <section className="studio-panel">
          <span className="studio-eyebrow">COURSE DEVELOPMENT</span>
          <h2>Create a lesson draft</h2>

          <form className="studio-form" onSubmit={addLesson}>
            <label>
              Course name
              <input
                value={course}
                onChange={(event) => setCourse(event.target.value)}
                placeholder="e.g. Introduction to Artificial Intelligence"
                required
              />
            </label>

            <label>
              Lesson title
              <input
                value={lessonTitle}
                onChange={(event) => setLessonTitle(event.target.value)}
                placeholder="e.g. Understanding machine learning"
                required
              />
            </label>

            <label>
              Lesson description and learning objectives
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                placeholder="Describe what learners should understand or achieve..."
              />
            </label>

            <button type="submit">Add lesson draft</button>
          </form>
        </section>

        <section className="studio-panel">
          <span className="studio-eyebrow">VIDEO LIBRARY</span>
          <h2>Add a teaching video</h2>
          <p className="studio-helper">
            Add a reference to a video from a supported provider. This stage
            records the link in temporary page state; it does not embed or
            publish the video.
          </p>

          <form className="studio-form" onSubmit={addVideo}>
            <label>
              Video title
              <input
                value={videoTitle}
                onChange={(event) => setVideoTitle(event.target.value)}
                placeholder="Enter the video title"
                required
              />
            </label>

            <label>
              Video provider
              <select
                value={videoProvider}
                onChange={(event) => setVideoProvider(event.target.value)}
              >
                <option>YouTube</option>
                <option>Vimeo</option>
                <option>Other video provider</option>
              </select>
            </label>

            <label>
              Video URL
              <input
                type="url"
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                placeholder="https://..."
                required
              />
            </label>

            <button type="submit">Add video resource</button>
          </form>
        </section>

        <section className="studio-panel">
          <div className="edu-section-heading">
            <div>
              <span className="studio-eyebrow">CONTENT IN PROGRESS</span>
              <h2>Lesson drafts</h2>
            </div>
            <span className="studio-count">{lessons.length}</span>
          </div>

          {lessons.length === 0 ? (
            <p className="studio-empty-state">
              Your lesson drafts will appear here when you create them.
            </p>
          ) : (
            <div className="studio-entry-list">
              {lessons.map((lesson) => (
                <article className="studio-entry" key={lesson.id}>
                  <strong>{lesson.title}</strong>
                  <span>{lesson.course}</span>
                  {lesson.description && <p>{lesson.description}</p>}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="studio-panel">
          <div className="edu-section-heading">
            <div>
              <span className="studio-eyebrow">TEACHING MATERIALS</span>
              <h2>Video resources</h2>
            </div>
            <span className="studio-count">{videos.length}</span>
          </div>

          {videos.length === 0 ? (
            <p className="studio-empty-state">
              Added video references will appear here.
            </p>
          ) : (
            <div className="studio-entry-list">
              {videos.map((video) => (
                <article className="studio-entry" key={video.id}>
                  <strong>{video.title}</strong>
                  <span>{video.provider}</span>
                  <a href={video.url} target="_blank" rel="noreferrer">
                    Open video reference →
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="studio-panel studio-wide-panel">
          <span className="studio-eyebrow">ASSESSMENT PREPARATION</span>
          <h2>Plan your next assessment</h2>
          <p>
            Prepare learning outcomes and draft questions with the AI
            teaching assistant. Review all generated material before using
            it with learners.
          </p>
          <Link
            className="edu-primary-link"
            to="/hybrid-ai"
            state={{ sourceStudio: '/lecturer-studio', prompt: aiPrompt }}
          >
            Prepare teaching material with Hybrid AI →
          </Link>
        </section>
      </div>

      {notice && (
        <p className="studio-status" role="status">
          {notice}
        </p>
      )}

      <p className="studio-demo-notice">
        Lecturer Studio preview: lesson drafts and video references are
        temporary browser state. Authentication, lecturer permissions,
        database persistence, video embedding and publishing workflows
        still need backend integration.
      </p>
    </main>
  );
}
