import express from 'express';
import cors from 'cors';
import {agent} from './agent.js'

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("hello");
});

app.post('/generate', async (req, res) => {
    const { query, video_id, thread_id } = req.body;
    // console.log(query, video_id, thread_id);

    const results1 = await agent.invoke({
        messages: [
            {
                role: 'user',
                content: query,
            }
        ],
    }, { configurable: { thread_id: 1, video_id } });
    // console.log(results1.messages.at(-1)?.content);

    res.send(results1.messages.at(-1)?.content);
});

app.listen(3000, () => {
    console.log("Server is running");
});