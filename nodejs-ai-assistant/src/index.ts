const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));


const aiAgentCache = new Map<string, AIAgent>();
const pendingAiAgents = new Set<string>();
 

const inactivityThreshold = 480 * 60 * 1000;


setInterval(async () => {
  const now = Date.now();
  for (const [userId, aiAgent] of aiAgentCache) {
    if (now - aiAgent.getLastInteraction() > inactivityThreshold) {
      console.log(`Disposing AI Agent due to inactivity: ${userId}`);
      await disposeAiAgent(aiAgent);
      aiAgentCache.delete(userId);
    }
  }
}, 5000);
 

import { Request, Response } from "express";

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Ai writing assistant server is running",
    apiKey: apiKey,
    activeAgents: aiAgentCache.size,
  });
});