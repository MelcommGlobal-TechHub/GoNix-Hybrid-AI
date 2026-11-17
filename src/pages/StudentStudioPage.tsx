import { useState } from 'react';
import { Link } from 'react-router-dom';

const initialTasks = [
  { id: 1, title: 'Review my current course lessons', done: false },
  { id: 2, title: 'Write notes on the key concepts', done: false },
  { id: 3, title: 'Complete a practice session', done: false },
];

export default function StudentStudioPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [notes, setNotes] = useState('');
  const [studyGoal, setStudyGoal] = useState('Build a consistent daily study habit');

  const completed = tasks.filter((task) => task.done).length;

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTask.trim();
    if (!title) return;

    setTasks((current) => [
      ...current,
      { id: Date.now(), title, done: false },
    ]);
    setNewTask('');
  }

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  const aiPrompt = [
    'Help me with my study session.',
    `My study goal: ${studyGoal}.`,
    notes ? `My notes and context: ${notes}` : '',
    'Explain the topic clearly and give me practical exercises.',
  ].filter(Boolean).join('\n\n');

  return (
    <main className="edu-page studio-page">
      <section className="edu-page-hero">
        <span className="studio-eyebrow">YOUR PERSONAL LEARNING SPACE</span>
        <h1>Student Studio</h1>
        <p>
          Organise your learning, capture ideas, plan study sessions and get
          help understanding difficult topics.
        </p>
        <div className="studio-hero-actions">
          <Link className="edu-primary-link" to="/learning">Continue learning</Link>
          <Link
            className="studio-secondary-link"
            to="/hybrid-ai"
            state={{ sourceStudio: '/student-studio', prompt: aiPrompt }}
          >
            Open Hybrid AI →
          </Link>
        </div>
      </section>

      <section className="studio-stats" aria-label="Study overview">
        <article className="studio-stat">
          <span>Study tasks</span>
          <strong>{tasks.length}</strong>
        </article>
        <article className="studio-stat">
          <span>Completed</span>
          <strong>{completed}</strong>
        </article>
        <article className="studio-stat">
          <span>Remaining</span>
          <strong>{tasks.length - completed}</strong>
        </article>
      </section>

      <div className="studio-layout-grid">
        <section className="studio-panel">
          <div className="edu-section-heading">
            <div>
              <span className="studio-eyebrow">STAY ON TRACK</span>
              <h2>My study planner</h2>
            </div>
            <span className="studio-count">{completed}/{tasks.length}</span>
          </div>

          <div className="studio-progress-track" aria-label={`${tasks.length ? Math.round(completed / tasks.length * 100) : 0}% completed`}>
            <span style={{ width: `${tasks.length ? completed / tasks.length * 100 : 0}%` }} />
          </div>

          <div className="studio-task-list">
            {tasks.map((task) => (
              <label className={`studio-task ${task.done ? 'is-done' : ''}`} key={task.id}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.title}</span>
              </label>
            ))}
          </div>

          <form className="studio-inline-form" onSubmit={addTask}>
            <input
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              placeholder="Add a study task..."
              aria-label="New study task"
            />
            <button type="submit">Add task</button>
          </form>
        </section>

        <section className="studio-panel">
          <span className="studio-eyebrow">SET YOUR DIRECTION</span>
          <h2>My study goal</h2>
          <label className="studio-field-label" htmlFor="study-goal">
            What are you working towards?
          </label>
          <textarea
            id="study-goal"
            value={studyGoal}
            onChange={(event) => setStudyGoal(event.target.value)}
            rows={3}
            placeholder="Describe your learning goal..."
          />
          <p className="studio-helper">
            Your goal can help you frame a more useful AI study request.
          </p>
        </section>

        <section className="studio-panel studio-notes-panel">
          <span className="studio-eyebrow">YOUR LEARNING IDEAS</span>
          <h2>Study notes</h2>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={8}
            placeholder="Write your notes, questions, lesson summaries or topics you want to understand..."
            aria-label="Study notes"
          />
          <p className="studio-helper">
            These notes are held in this page's current browser session. They
            are not yet saved to an account or database.
          </p>
          <Link
            className="edu-primary-link"
            to="/hybrid-ai"
            state={{ sourceStudio: '/student-studio', prompt: aiPrompt }}
          >
            Ask Hybrid AI about my notes →
          </Link>
        </section>

        <section className="studio-panel">
          <span className="studio-eyebrow">QUICK ACCESS</span>
          <h2>Learning resources</h2>
          <div className="studio-resource-links">
            <Link to="/courses">Explore courses <span>→</span></Link>
            <Link to="/curriculum">Browse curriculum <span>→</span></Link>
            <Link to="/learning">My learning dashboard <span>→</span></Link>
            <Link to="/hybrid-ai">AI learning assistant <span>→</span></Link>
          </div>
        </section>
      </div>

      <p className="studio-demo-notice">
        Studio workspace preview: tasks and notes currently use temporary
        browser state. Account synchronisation and cloud storage are not yet
        connected.
      </p>
    </main>
  );
}
