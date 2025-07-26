import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { MemorySaver } from '@langchain/langgraph';
import { vectorStore, addYTVideoToVectorStore } from "./embeddings.js";
import data from './data.js';
import { fetchAndSaveTranscript } from './videoscrape.js';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document }                       from '@langchain/core/documents';



const triggerYoutubeVideoScrapeTool = tool(
  async ({ url }) => {
    console.log('🔨 scraping transcript for', url);

    // fetchAndSaveTranscript will:
    // 1. extract video_id
    // 2. download + assemble the transcript
    // 3. write data/<video_id>.json
    // 4. return { video_id, transcript }
    const { video_id, transcript } = await fetchAndSaveTranscript(url);

    // then chunk & index exactly as before
    const { chunkSize, chunkOverlap } = { chunkSize: 1000, chunkOverlap: 200 };
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize, chunkOverlap });
    const doc = new Document({ pageContent: transcript, metadata: { video_id } });
    const chunks = await splitter.splitDocuments([doc]);
    await vectorStore.addDocuments(chunks);

    console.log('✅ transcript scraped & indexed for', video_id);
    // you can return the video_id (like a snapshotId)
    return video_id;
  },
  {
    name:        'triggerYoutubeVideoScrape',
    description: `
      Given a YouTube URL, immediately fetch its transcript via an npm package,
      save it to JSON, chunk it, and index it into the vector store.
      Returns the extracted video_id.
    `,
    schema: z.object({
      url: z.string(),
    }),
  }
);


// await addYTVideoToVectorStore(data[0]);
// await addYTVideoToVectorStore(data[1]);

// const video_id= "video_014";
// retrieval tool
const retrievalTool= tool(async ({query,video_id})=>{
     console.log('retrieving docs for query');
     console.log(query);
     console.log(video_id);
     const retrievedDocs=await vectorStore.similaritySearch(
        query,
        3,
        {video_id,}
    );
    // console.log("retrieved docs are:");
    // console.log(retrievedDocs);
    // const filteredDocs = retrievedDocs.filter(doc => doc.metadata.video_id === video_id);
    // console.log("filtered docs are:");
    // console.log(filteredDocs);
     //the above gives me 1 docs, and now i put it all in one
     const serializeDocs=retrievedDocs.map((doc)=>doc.pageContent).join('\n');
     return serializeDocs;
},{
    //its meta data, and llm knows through description what this tool is supposed to do and when to use
    name: 'retrieve',
    description: 'Search video transcripts to answer questions.',
    schema: z.object({
        query: z.string(),
        video_id: z.string().describe('The id of the video to retrieve.'), 
    }),
});
//zod helps us create schema of how object should look like and tools need schema so that llm knows what input data to send where
// retrieving the most relevant chunks
// const retrievedDocs=await vectorStore.similaritySearch("Why my name is Himanshu?",1);
// console.log("--- Similarity Search Results ---", retrievedDocs);

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash-latest", 
});

const checkpointer=new MemorySaver();

export const agent=createReactAgent({
    llm, 
    tools: [
        retrievalTool,
        // triggerYoutubeVideoScrapeTool
    ], 
    checkpointer,
    system: `You are a helpful AI assistant that can answer questions about specific YouTube videos.

- If the user asks a question about the video's content, use the "retrieve" tool to find the answer in the transcript.
- If the user provides a new YouTube URL, use the "triggerYoutubeVideoScrape" tool to process it.
- For simple greetings or general conversation (like "hello", "how are you?", "who are you?"), answer directly without using any tools.`,
});

/// testing the agent

