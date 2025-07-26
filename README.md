# 💬 ChatWithYoutube

A conversational AI agent that lets you "talk" to YouTube videos. Ask questions about a video's content, and get answers sourced directly from its transcript using the power of Google's Gemini model and LangChain.

🔗 **Live Demo:** *`https://chat-with-youtube-cjhf.vercel.app/`*

The backend server is hosted on Render's free tier and may spin down due to inactivity. After opening the live demo, please allow up to one minute for the server to wake up.

---

## ✨ Features

* **Conversational Q&A:** Ask questions about a YouTube video in natural language.
* **AI-Powered Answers:** Leverages Google's **Gemini Flash** model via LangChain to provide context-aware responses.
* **Vector Search Retrieval:** Performs lightning-fast similarity searches on video transcripts stored in a **MongoDB Atlas Vector Store** to find the most relevant information.
* **Persistent Conversations:** Remembers chat history within a session, allowing for follow-up questions.
* **Decoupled Architecture:** A modern full-stack application with a React frontend and a Node.js backend.

---

## 🛠️ Tech Stack

#### Frontend:
* **Framework:** React
* **Build Tool:** Vite
* **Styling:** CSS

#### Backend:
* **Runtime:** Node.js
* **Framework:** Express.js
* **AI Orchestration:** LangChain.js (`@langchain/langgraph`)
* **LLM:** Google Generative AI (`@langchain/google-genai`)
* **Vector Database:** MongoDB Atlas Vector Search
* **Module System:** ES Modules

---
## 🏛️ How It Works

This application uses a sophisticated **Retrieval-Augmented Generation (RAG)** architecture to provide accurate answers.

1.  **Data Ingestion:** A YouTube video's transcript is chunked and converted into numerical vectors (embeddings).
2.  **Vector Storage:** These embeddings are stored and indexed in a MongoDB Atlas collection.
3.  **User Query:** A user asks a question through the React frontend.
4.  **Retrieval:** The LangChain agent receives the query and uses a **retrieval tool** to perform a vector search on the MongoDB store, finding the most relevant transcript chunks.
5.  **Generation:** The retrieved chunks are passed as context along with the user's question to the Gemini model.
6.  **Response:** The LLM generates a final, context-aware answer, which is streamed back to the user.

---

## 🔧 Getting Started Locally

Follow these instructions to run the project on your local machine.

1.  **Clone the repository:**
    ```bash
    git clone [Your-GitHub-Repo-Link]
    cd ChatWithYoutube
    ```

2.  **Install all dependencies:**
    ```bash
    npm install
    ```

3.  **Create your environment file:**
    Create a `.env` file in the root directory and add the following variables. You will need to create a **Google AI API Key** and a **MongoDB Atlas** cluster with a vector search index.

    ```env
    # Your Google Gemini API Key
    GOOGLE_API_KEY="AIzaSy..."

    # Your MongoDB Atlas Connection String
    MONGODB_ATLAS_URI="mongodb+srv://..."

    # Your Database and Collection Names
    MONGODB_ATLAS_DB_NAME="ai_youtube_chat"
    MONGODB_ATLAS_COLLECTION_NAME="video_transcripts"
    ```

4.  **Run the Application:**
    You need to run the backend server and the frontend client in two separate terminals.

    * **Terminal 1: Run the Backend Server**
        ```bash
        npm run start # Or your custom script to run index.js
        ```
        The server will be running on `http://localhost:3000`.

    * **Terminal 2: Run the Frontend Client**
        ```bash
        npm run dev
        ```
        The application will be live at the address provided by Vite (usually `http://localhost:5173`).

---

## ☁️ Deployment

The application is deployed with a decoupled front-end and back-end architecture.

* **Frontend:** The React/Vite application is hosted on **Vercel**.
* **Backend:** The Node.js and LangChain server is hosted on **Render**.
 * **Backend URL:** `https://chatwithyoutube-backend1.onrender.com/`

---

## 👤 Author

**Himanshu**

---

## 📜 License

This project is licensed under the MIT License.