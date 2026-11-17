import { useState } from 'react';

const questions = [
  {
    question: 'What does AI stand for?',
    options: ['Automated Internet', 'Artificial Intelligence', 'Advanced Interface', 'Applied Information'],
    answer: 1,
    explanation: 'AI stands for Artificial Intelligence: systems designed to perform tasks that normally require human intelligence.',
  },
  {
    question: 'Which of these is an example of machine learning?',
    options: ['A printed textbook', 'A basic light switch', 'A model learning patterns from data', 'A paper notebook'],
    answer: 2,
    explanation: 'Machine learning systems identify patterns in data and use them to make predictions or decisions.',
  },
  {
    question: 'What is a good way to protect an online account?',
    options: ['Reuse one password everywhere', 'Share passwords with friends', 'Use a strong unique password and MFA', 'Disable account security'],
    answer: 2,
    explanation: 'A unique strong password and multi-factor authentication provide better account protection.',
  },
  {
    question: 'Which format is commonly used for structured web data?',
    options: ['JSON', 'MP3', 'JPEG', 'WAV'],
    answer: 0,
    explanation: 'JSON is a widely used format for representing structured data.',
  },
  {
    question: 'What should you do before trusting an AI-generated answer?',
    options: ['Publish it immediately', 'Verify important claims', 'Assume it is always correct', 'Ignore its sources'],
    answer: 1,
    explanation: 'AI-generated information can contain mistakes. Verify important facts using reliable sources.',
  },
];

export default function AssessmentsPage() {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = questions.reduce(
    (total, question, index) => total + (answers[index] === question.answer ? 1 : 0),
    0,
  );

  function restart() {
    setAnswers({});
    setSubmitted(false);
    setStarted(false);
  }

  return (
    <main className="edu-page studio-page">
      <section className="edu-page-hero">
        <span className="studio-eyebrow">PRACTISE • TEST • IMPROVE</span>
        <h1>Assessments</h1>
        <p>Test your understanding, practise important concepts and review your answers.</p>
      </section>

      <section className="studio-stats">
        <article className="studio-stat"><span>Practice assessments</span><strong>1</strong></article>
        <article className="studio-stat"><span>Questions in this quiz</span><strong>{questions.length}</strong></article>
        <article className="studio-stat"><span>Your score</span><strong>{submitted ? `${score}/${questions.length}` : '—'}</strong></article>
      </section>

      <section className="studio-panel assessment-panel">
        <div className="edu-section-heading">
          <div>
            <span className="studio-eyebrow">PRACTICE QUIZ</span>
            <h2>Digital Skills Foundations</h2>
          </div>
          <span className="studio-count">5 questions</span>
        </div>

        {!started ? (
          <div className="assessment-intro">
            <p>This short practice quiz covers introductory AI, digital skills and online safety.</p>
            <ul>
              <li>Five multiple-choice questions</li>
              <li>One answer per question</li>
              <li>Explanations after submission</li>
              <li>Instant practice score</li>
            </ul>
            <button className="studio-action-button" onClick={() => setStarted(true)}>
              Start practice quiz →
            </button>
          </div>
        ) : (
          <>
            <div className="assessment-progress">
              <span>{Object.keys(answers).length} of {questions.length} answered</span>
              <div className="studio-progress-track">
                <span style={{ width: `${Object.keys(answers).length / questions.length * 100}%` }} />
              </div>
            </div>

            {questions.map((question, index) => (
              <fieldset className="assessment-question" key={question.question} disabled={submitted}>
                <legend>{index + 1}. {question.question}</legend>
                <div className="assessment-options">
                  {question.options.map((option, optionIndex) => (
                    <label
                      className={`assessment-option ${
                        answers[index] === optionIndex ? 'selected' : ''
                      } ${
                        submitted && optionIndex === question.answer ? 'correct' : ''
                      } ${
                        submitted && answers[index] === optionIndex && optionIndex !== question.answer ? 'incorrect' : ''
                      }`}
                      key={option}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        checked={answers[index] === optionIndex}
                        onChange={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {submitted && (
                  <p className="assessment-explanation">
                    {answers[index] === question.answer ? 'Correct. ' : 'Not quite. '}
                    {question.explanation}
                  </p>
                )}
              </fieldset>
            ))}

            {!submitted ? (
              <button
                className="studio-action-button"
                disabled={Object.keys(answers).length !== questions.length}
                onClick={() => setSubmitted(true)}
              >
                Submit answers
              </button>
            ) : (
              <div className="assessment-result" role="status">
                <span className="studio-eyebrow">PRACTICE RESULT</span>
                <h3>{score} / {questions.length}</h3>
                <p>
                  {score === questions.length
                    ? 'Excellent work! You answered every question correctly.'
                    : 'Review the explanations above and try again to improve your understanding.'}
                </p>
                <button className="studio-action-button" onClick={restart}>Try again</button>
              </div>
            )}
          </>
        )}
      </section>

      <p className="studio-demo-notice">
        This is a practice demonstration. Results are held temporarily in the page and are not official examination records.
      </p>
    </main>
  );
}
