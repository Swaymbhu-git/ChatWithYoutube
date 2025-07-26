import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb"
import { MongoClient } from "mongodb";
import { RecursiveCharacterTextSplitter} from '@langchain/textsplitters'
import { Document } from '@langchain/core/documents';


//Embedding chunks
const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004", // The specific model for creating embeddings
});

//setting up mongodb MongoDBAtlasVectorSearch
const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
await client.connect();
const collection = client
    .db(process.env.MONGODB_ATLAS_DB_NAME)
    .collection(process.env.MONGODB_ATLAS_COLLECTION_NAME);

// The vectorStore now takes the collection directly in its configuration
export const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: "vector_index", // The name of the vector index you will create in Atlas
});

export const addYTVideoToVectorStore = async (videoData) => {
    const {transcript, video_id}=videoData;
const docs = [
    new Document({
        pageContent: transcript,
        metadata: { video_id: video_id }
    }),
];


    ///split the video into chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
        /// means that individual chunk sizes 
        // are going to be of 1000 characters and next chunk 
        // will consist of previous 200 character of old chunk in 
        // its starting
    });

    const chunks = await splitter.splitDocuments(docs);
    // console.log('Cleaning started');
    //await collection.deleteMany({}); //use this line when to clear all pre existing data
    // console.log('Cleaning done');
    await vectorStore.addDocuments(chunks); // use when need to add data
    console.log('data added');
    // await collection.deleteMany({});
    console.log("Number of documents in collection:", await collection.countDocuments());
    // for (const doc of docs) {
    //     console.log("Added doc:", doc.pageContent);
    // }
};