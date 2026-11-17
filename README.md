# GoNix EduPlus — Hybrid AI Learning & Productivity Platform

**Learn More. Become More.**

GoNix EduPlus is an AI-powered learning and productivity platform built around a hybrid inference architecture. It is designed to use on-device artificial intelligence whenever the user's device and browser support it, while enabling cloud-based intelligence through Firebase AI Logic when additional capability is needed and the user has explicitly permitted cloud access.

**Core principle: Local Intelligence. Cloud Power. One AI Experience.**

---

## 1. Project Overview

GoNix EduPlus brings together AI-assisted learning, educational productivity, student and lecturer tools, and intelligent platform assistance.

Its defining innovation is its hybrid AI architecture:

- On-device inference for supported devices and browsers.
- Firebase AI Logic for cloud inference.
- User-controlled cloud consent.
- Inference-mode selection.
- App Check integration for cloud AI access.
- A shared AI settings system across the application.

Rather than assuming every user has a powerful device or a reliable internet connection, GoNix EduPlus is designed to adapt its inference strategy to available capabilities and user preferences.

## 2. Challenge Alignment

The project addresses the central challenge of building an AI application that can operate on-device when possible and use cloud inference when necessary through Firebase AI Logic.

| Challenge requirement | GoNix EduPlus approach |
|---|---|
| On-device AI | Uses the browser's supported on-device Language Model API |
| Cloud AI | Integrates Firebase AI Logic |
| Hybrid inference | Shared inference engine supports local and cloud strategies |
| Intelligent fallback | Inference mode and device capability determine the available execution path |
| User control | Cloud inference requires explicit user consent |
| Web application | React and TypeScript web application |
| Significant application upgrade | Adds a hybrid AI experience to the GoNix EduPlus learning platform |
| Responsible AI integration | App Check, inference-source verification and privacy-aware execution |

The current deliverable is the web application. Native Android and iOS applications are potential future delivery targets, not claims of completed native releases.

## 3. What Makes GoNix Hybrid AI Different?

### On-device intelligence

When supported, AI tasks can run locally through the browser's on-device Language Model API.

Benefits include:
- Reduced dependence on remote AI services.
- Better privacy for supported local inference.
- Potentially lower network latency.
- Access to AI capabilities in environments with limited connectivity, subject to device and model availability.

### Firebase AI Logic cloud inference

When local inference is unavailable or unsuitable, the application can use Firebase AI Logic for cloud-based AI processing.

Cloud execution is governed by the user's selected inference strategy and explicit cloud-consent preference.

The application does not silently grant cloud consent merely because a user selects a cloud-oriented mode.

### Four inference strategies

The shared hybrid AI engine supports:

- `PREFER_ON_DEVICE` — prioritize local inference.
- `PREFER_IN_CLOUD` — prioritize cloud inference when consent is granted.
- `ONLY_ON_DEVICE` — never use cloud fallback.
- `ONLY_IN_CLOUD` — require cloud consent and use the cloud path.

The engine checks the execution environment, enforces consent requirements, streams supported responses, verifies the inference source and handles transient failures.

## 4. Platform Features

### GoNix Hybrid AI
The central AI experience for interacting with the hybrid inference engine.

### GoNix AI Agent
A conversational assistant that reuses the same hybrid inference engine and shared AI settings.

### GoNix Customer Care
An integrated support experience with:
- AI-powered platform assistance.
- Chat interface.
- Voice input and speech output where browser capabilities permit.
- Frequently asked questions.
- Feedback form interface.

The current feedback experience is a local preview; server-side feedback submission is not yet connected.

### Learning and education
The application includes learning-oriented areas such as:
- Learning dashboard.
- Courses and curriculum.
- Student Studio.
- Lecturer Studio.
- Assessments.
- Certificates.
- Learning progress.

### Community and productivity
Additional application areas include:
- Community.
- Messages.
- Notifications.
- Opportunities.
- User profile and settings.

Some of these areas currently use demonstration or session-local data. Their presence in the interface does not imply that every feature has a production backend.

## 5. Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| TypeScript 5.9 | Type safety |
| Vite 8 | Development and production build |
| Firebase AI Logic | Cloud AI inference |
| Firebase App Check | Application attestation for supported cloud requests |
| Browser Language Model API | Supported on-device inference |
| Firebase Hosting | Web application hosting |
| Local Storage | Local user preferences and selected interface state |

## 6. Hybrid AI Architecture

```text
                  GoNix EduPlus
                        |
                 User AI Request
                        |
                Hybrid AI Engine
                        |
             Read Shared AI Settings
                        |
              Check Device Support
                        |
             +----------+----------+
             |                     |
       Local Available       Local Unavailable
             |                     |
      On-device Model       Check Cloud Consent
             |                     |
      Local Inference        +------+------+
             |               |             |
             |            Granted       Not Granted
             |               |             |
             |        Firebase AI Logic  No Cloud
             |               |           Execution
             +---------------+
                     |
              Verify AI Source
                     |
               Return Response
```

The actual execution path depends on the selected inference mode, browser capabilities, consent state and service availability.

## 7. Privacy and Security

GoNix EduPlus follows a privacy-aware hybrid AI design.

- Cloud consent defaults to disabled.
- Selecting a cloud-oriented inference mode does not automatically grant consent.
- Local-only inference does not use cloud fallback.
- Cloud AI requests require the configured App Check protection.
- Inference source is checked before the response is accepted.
- Firebase configuration is supplied through environment variables.
- Private credentials and service-account keys must never be committed to the repository.

On-device inference availability depends on browser support, device capability and model availability. Cloud inference requires connectivity and valid Firebase configuration.

## 8. Project Structure

```text
GoNix-Hybrid-AI/
├── public/
├── src/
│   ├── components/
│   │   └── CustomerCare.tsx
│   ├── context/
│   │   └── AISettingsContext.tsx
│   ├── layouts/
│   ├── lib/
│   │   ├── firebase.ts
│   │   └── hybrid-ai.ts
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── .gitignore
├── firebase.json
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 9. Getting Started

### Requirements

- Node.js 24 recommended.
- npm.
- A Firebase project.
- A supported browser for on-device inference testing.

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create `.env.local` in the project root.

```env
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_firebase_web_app_id
VITE_RECAPTCHA_ENTERPRISE_SITE_KEY=your_recaptcha_enterprise_site_key
```

Use the Firebase configuration belonging to your own registered web application.

Do not commit `.env.local` or private credentials.

### Run the development server

```bash
npm run dev -- --host 0.0.0.0
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview -- --host 0.0.0.0
```

## 10. Firebase Hosting Deployment

The project is configured for Firebase Hosting with the production build output in `dist`.

Authenticate:

```bash
firebase login
```

Select the project:

```bash
firebase use gonix-hybrid-ai
```

Build:

```bash
npm run build
```

Deploy the frontend:

```bash
firebase deploy --only hosting
```

### Current deployment

Firebase Hosting:

https://gonix-hybrid-ai.web.app

Firebase project:

`gonix-hybrid-ai`

## 11. Current Implementation Status

### Implemented in the current web application

- React and TypeScript application.
- Firebase project configuration.
- Firebase AI Logic integration.
- Hybrid AI inference engine.
- On-device inference capability checks.
- Cloud-consent enforcement.
- Inference strategy settings.
- Shared AI settings context.
- AI Agent using the shared hybrid engine.
- Customer Care interface with chat, voice, FAQs and feedback preview.
- Responsive application interface.
- Firebase Hosting deployment.

### Requires further implementation or verification

- Native Android and iOS application packaging.
- Production authentication and user identity flows.
- Persistent Firestore-backed messaging.
- Production push notification delivery.
- Server-side feedback submission and support ticket handling.
- Persistent community and notification data.
- Full cross-device synchronization.
- Broader device and browser compatibility testing.
- Automated security, performance and accessibility testing.

These items are future implementation or verification work, not represented as completed capabilities.

## 12. Testing and Evaluation

The project should be evaluated against the following criteria:

1. Verify local inference on a browser and device that support the required API.
2. Verify that unsupported local inference does not silently trigger cloud execution without consent.
3. Verify cloud inference through Firebase AI Logic after explicit consent.
4. Verify that local-only mode never uses the cloud.
5. Verify cloud access and App Check configuration.
6. Confirm the reported inference source matches the actual execution path.
7. Test network interruption and transient failures.
8. Test responsive behaviour on mobile and desktop.
9. Verify that the application does not expose private credentials.
10. Test the deployed application independently of the development environment.

## 13. Roadmap

### Phase 1 — Hybrid AI foundation
Completed foundation: shared inference engine, device capability checks, Firebase AI Logic integration and cloud-consent controls.

### Phase 2 — AI learning and assistance
Continue improving AI-assisted learning, conversational assistance, learning workflows and platform support.

### Phase 3 — Visual AI and productivity
Expand visual result generation, structured diagrams, charts, mind maps, flowcharts and export capabilities as they are implemented and tested.

### Phase 4 — Persistent platform services
Connect authentication, Firestore-backed data, messaging, notifications and support workflows.

### Phase 5 — Cross-platform expansion
Evaluate Android and iOS delivery, platform-specific inference capabilities and native integration.

## 14. Vision

GoNix EduPlus aims to make intelligent learning and productivity more accessible by combining local AI capabilities with cloud intelligence under user control.

Its goal is not simply to add a chatbot to an education platform. It is to build an adaptable AI environment that can choose an appropriate execution path based on device capability, user preference and available services.

**GoNix EduPlus — Learn More. Become More.**

**GoNix Hybrid AI — Local Intelligence. Cloud Power. One AI Experience.**

---

## License

Add the project's chosen open-source or proprietary license before public distribution. Until a license is added, no reuse rights should be assumed.
