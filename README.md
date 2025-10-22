# Advanced-Subtitle-Generator Web App

Whisper Subtitle Generator Web App
This is a full-featured web application for generating accurate, multilingual subtitles from video files using OpenAI's Whisper speech recognition models. It runs entirely client-side in the browser leveraging Web Workers for scalability and responsiveness.

Features
Video Upload & Audio Extraction: Load videos in the browser and extract audio with automatic resampling to 16 kHz for Whisper input.

Model Selection: Choose from multiple Whisper models (tiny, base, small, medium, large) balancing speed and accuracy.

Chunked Transcription with Overlap: Transcribes audio in overlapping 30-second chunks with a 5-second stride to prevent cut-offs or missing speech segments.

Beam Search Decoding: Uses beam search during transcription for improved accuracy.

Real-time Progress Updates: Displays dynamic progress and estimated subtitle generation times based on actual processing.

Subtitle Merging & Deduplication: Combines overlapping chunk transcriptions seamlessly to deliver continuous, precise subtitles.

Subtitle Editing Timeline: Interactive timeline for editing subtitle text and timestamps with live preview.

Multi-language Translation: Integrates with LibreTranslate API for batch translation of subtitles into any supported language.

Subtitle Styling Customization: Customize subtitle font size, color, background opacity, and position live.

Download Options: Export subtitles as SRT and WebVTT formats for easy integration with video players.

Robust Error Handling: Gracefully manages model load errors, transcription failures, and translation issues.

Performance Optimization: Uses Web Workers and asynchronous chunk processing to optimize browser performance and UI responsiveness.

Self-contained, Client-side: No server dependencies, runs securely and privately in user’s browser.

How It Works
The video file is loaded and audio extracted/resampled.

The audio is split into overlapping chunks and asynchronously fed to Whisper in a Web Worker.

Transcriptions from all chunks are merged carefully to produce a high-quality subtitle set.

Users can translate, edit, style, preview, and download the resulting subtitles.

This app is ideal for accessible video content creation, multilingual video captioning, and efficient, accurate subtitle generation directly from the browser.
