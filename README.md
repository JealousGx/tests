# Real-time Audio Transcription and Translation

This project is a Next.js web application for real-time audio transcription and translation.

I tried to implement the requirements from [Numeo Engineering Challenge](https://github.com/numeo-ai/numeo-engineering-challenge/) in this project and is basically a submission for the challenge.

## Getting Started

First, run the development server:

```bash
pnpm dev
pnpm ws:dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Assumptions and Trade-offs

Here are some key assumptions and trade offs made in this project:

### Assumptions:

1.  **Separate WebSocket Server for Real-Time:** The project assumes a separate WebSocket server is the best way to handle real-time audio processing. This adds architectural complexity (managing two services) but decouples real-time processing from the main application, benefiting performance and scalability.
2.  **Audio as a Data URI:** The project passes audio to the Gemini model by converting it to a data URI and passing it as an "image". This is a workaround for current AI SDK limitations, adding overhead and potential brittleness with future updates.
3.  **No Authentication:** The application does not implement any authentication or user management features, assuming it's not required for the challenge scope. This simplifies development but may limit usability in real-world scenarios.

### Other Trade-offs:

1.  **Monorepo:** The Next.js application and the WebSocket server are managed within a single repository. This simplifies initial development and dependency management but could become harder to manage as the project grows.
2.  ** In-Memory State Management:** The application uses in-memory state management for handling transcription and translation data. This is simpler to implement but may not be suitable for larger-scale applications requiring persistence or multi-user support.
3.  **Limited Error Handling:** The application includes basic error handling but does not cover all edge cases. This speeds up development but may lead to a less robust user experience in production.
4.  **Short Speech Segments:** The application processes short audio segments for transcription and translation to ensure responsiveness. This may limit the ability to handle longer conversations effectively.
