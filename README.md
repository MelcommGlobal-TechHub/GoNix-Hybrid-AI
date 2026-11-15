# GoNix Hybrid AI

### Intelligent by Design. Local Intelligence. Cloud Power. One AI Experience.

GoNix Hybrid AI is an intelligent AI services platform developed by B12 TechHub as part of the GoNix ecosystem.

It combines browser-supported on-device artificial intelligence with Firebase AI Logic cloud inference to deliver flexible, privacy-conscious AI experiences. It intelligently supports different inference strategies, allows users to control cloud processing, and identifies the actual source of every AI response.

**Create intelligently. Learn faster. Work smarter. Stay in control of your data.**

---

## 1. What is GoNix Hybrid AI?

GoNix Hybrid AI brings together local AI capabilities and cloud intelligence in one application.

Instead of depending exclusively on remote AI services, the platform supports on-device inference when the user's browser and device provide the required capabilities. When cloud processing is selected and permitted, Firebase AI Logic provides access to Gemini cloud models.

The platform is designed around three principles:

- **Intelligence:** Choose the appropriate inference strategy for each task.
- **Privacy:** Give users control over whether prompts may be processed in the cloud.
- **Transparency:** Report whether a response was generated on the device or in the cloud.

GoNix Hybrid AI is designed for developers, learners, creators, professionals and organisations that want more flexible AI experiences.

## 2. Core hybrid AI engine

The application implements four inference modes.

| Mode | Description |
|---|---|
| PREFER_ON_DEVICE | Prioritises local inference. Cloud fallback is allowed only when the user has granted cloud permission. |
| PREFER_IN_CLOUD | Prioritises Gemini cloud inference, with local fallback where supported by the SDK. |
| ONLY_ON_DEVICE | Restricts inference to the device. Cloud fallback is not permitted. |
| ONLY_IN_CLOUD | Uses cloud inference only and requires cloud permission. |

The inference engine uses Firebase AI Logic's hybrid inference capabilities and checks the inference source reported in the response metadata.

The application distinguishes between:

- ON_DEVICE — inference performed on the user's device.
- IN_CLOUD — inference performed through the cloud backend.

It does not intentionally represent cloud-generated responses as local responses.

## 3. AI services and capabilities

GoNix Hybrid AI provides a foundation for practical AI services across the GoNix ecosystem.

### AI Playground
An interactive environment for submitting prompts, selecting inference strategies and viewing AI-generated responses.

### On-device AI
Supports browser-based local inference when the required LanguageModel API, secure context and compatible device model are available.

### Cloud AI
Connects to Gemini through Firebase AI Logic for cloud-based AI processing when the selected mode and user permission allow it.

### Hybrid AI routing
Supports inference strategies that prioritise local or cloud processing and make fallback decisions according to the selected mode.

### Learning assistance
Designed to support AI explanations, learning assistance, lesson summaries, study support and guided practice.

### Intelligent content assistance
Provides a foundation for creators and developers to use AI for writing assistance, prompt improvement, idea development and productivity.

### Practice and knowledge support
Can support the development of practice questions, explanations and learning activities grounded in authorised educational content.

These services can be extended as the GoNix ecosystem grows.

## 4. Privacy, consent and security

Privacy and user control are important parts of the application architecture.

Current safeguards include:

- Cloud inference requires explicit permission.
- Local-first inference is restricted to local-only when cloud permission is absent.
- Local-only requests are blocked when the required browser capability is unavailable.
- Cloud requests require client-side App Check initialization.
- Firebase's reported inference source is checked before a response is accepted.
- Prompt length is validated before inference.

Firebase App Check uses Fraud Defense (reCAPTCHA Enterprise) for web attestation.

Client-side App Check initialization and Firebase Console enforcement are separate configuration requirements. Enforcement should be enabled after legitimate application traffic has been verified.

Users should avoid submitting passwords, private keys, financial credentials or sensitive personal information as prompts.

## 5. Technology stack

| Technology | Purpose |
|---|---|
| React 19 | Application interface |
| TypeScript | Application logic and type safety |
| Vite | Development and production builds |
| Firebase JavaScript SDK | Firebase integration |
| Firebase AI Logic | Hybrid and cloud AI inference |
| Gemini Developer API | Cloud AI model access |
| Firebase App Check | Application attestation |
| reCAPTCHA Enterprise | Web application verification |
| Oxlint | Code quality checks |
| Firebase Hosting | Web application hosting |

## 6. Browser and device compatibility

On-device inference depends on browser support and hardware availability.

The application checks:

- Browser availability of the LanguageModel API.
- Secure browser context.
- Device model initialization.
- Actual inference success.

Detecting the browser API does not guarantee that the model can be downloaded or executed. Availability depends on browser version, device compatibility, storage, model support and runtime conditions.

Cloud inference remains a separate capability and requires the Firebase project and App Check configuration to be operational.

## 7. GoNix ecosystem integration

GoNix Hybrid AI is designed to enhance GoNix 3.0, the GoNix Creator and Innovators Economy.

Potential integration areas include:

- AI Africa Learning Hub.
- Intelligent lesson assistance.
- AI-powered learning summaries.
- Lesson-grounded practice and assessments.
- Creator Studio assistance.
- Developer productivity tools.
- Intelligent content discovery and recommendations.

The integration is designed to preserve the responsibilities of the existing GoNix platform.

GoNix authentication, Supabase records, learning progress, assessment security, certificates and GoCredit reward validation remain under their existing platform services.

GoNix Hybrid AI must not independently credit wallets or bypass the existing reward engine.

## 8. Getting started

### Requirements

- Node.js 24 recommended.
- npm.
- A Firebase project.
- Firebase AI Logic enabled.
- A registered Firebase Web App.
- Firebase App Check configured.
- A reCAPTCHA Enterprise site key.

### Clone the repository

```bash
git clone https://github.com/MelcommGlobal-TechHub/GoNix-Hybrid-AI.git
cd GoNix-Hybrid-AI
npm ci
```

## Start the application

```bash
npm run dev
```

## Production build and quality checks

Run the following commands when preparing a release:

```bash
npm run build
npm run lint
npm run preview
```

```bash
npm run build
firebase deploy --only hosting
```

## Privacy and security

- Cloud inference requires user permission.
- Local-only mode does not permit cloud fallback.
- Local inference requires a compatible browser and device.
- Cloud inference requires Firebase App Check initialization.
- The application checks the inference source reported by Firebase AI Logic.
- Never submit passwords, private keys or financial credentials as prompts.

Client-side App Check initialization and Firebase Console enforcement are separate configuration requirements.

## GoNix ecosystem

GoNix Hybrid AI is developed by B12 TechHub as part of the GoNix ecosystem. It is designed to complement GoNix 3.0 while preserving the existing platform's authentication, Supabase records, learning progress, assessment security, certificates and GoCredit reward engine.

The AI engine does not independently credit wallets or bypass GoNix reward validation.
## Current capabilities

The application includes:

- React and TypeScript interface.
- Firebase AI Logic integration.
- Four inference modes.
- On-device capability detection and model preparation.
- Cloud-consent controls.
- Inference-source verification.
- Firebase App Check initialization.

Live cloud inference, App Check enforcement and compatible-device local inference must be validated through end-to-end testing.

## Vision

GoNix Hybrid AI brings local intelligence and cloud AI together to make digital experiences more flexible, useful and privacy-conscious.

**GoNix Hybrid AI — Intelligent by Design.**

## Licence

MIT License. See the `LICENSE` file.

## Developed by

**B12 TechHub**

Part of the GoNix Creator and Innovators Economy.
