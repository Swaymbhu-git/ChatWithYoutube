// videoscrape.js

import { YoutubeTranscript } from 'youtube-transcript';   // v1.2.1
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

/** Extract the video_id from any YouTube URL. */
function extractVideoId(url) {
  const m =
    url.match(/[?&]v=([^&]+)/) ||
    url.match(/youtu\.be\/(.+)/);
  return m ? m[1] : null;
}

/**
 * Fetch the transcript, write ./data/<video_id>.json, and return { video_id, transcript }.
 */
// ...existing code...

export async function fetchAndSaveTranscript(url) {
  const video_id = extractVideoId(url);
  if (!video_id) {
    throw new Error(`Could not parse video ID from URL: ${url}`);
  }

  try {
    // Try fetching with video ID instead of full URL
    const entries = await YoutubeTranscript.fetchTranscript(video_id);
    
    if (!entries || entries.length === 0) {
      throw new Error('Empty transcript');
    }
    
    const transcript = entries.map(e => e.text).join(' ');

    // Persist as JSON
    const outDir = path.resolve(process.cwd(), 'data');
    const outPath = path.join(outDir, `${video_id}.json`);
    await fs.ensureDir(outDir);
    await fs.writeJson(outPath,
      { video_id, transcript },
      { spaces: 2 }
    );

    return { video_id, transcript };
  } catch (error) {
    // Add more detailed error logging
    console.error('Failed to fetch transcript:', error.message);
    throw error;
  }
}

// Test section at bottom of file
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  (async () => {
    try {
      const testUrl = 'https://www.youtube.com/watch?v=5MgBikgcWnY'; // TED-Ed
      console.log('⏳ Testing fetchAndSaveTranscript with', testUrl);
      const { video_id, transcript } = await fetchAndSaveTranscript(testUrl);
      console.log('✅ video_id:', video_id);
      console.log('📄 transcript snippet:', transcript.slice(0, 200), '…');
    } catch (err) {
      console.error('❌ Error in fetchAndSaveTranscript:', err);
    }
  })();
}
