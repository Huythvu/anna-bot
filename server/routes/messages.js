import express from "express";
import { loadMessages, saveMessages } from "../data/messages.js";
import { loadAnswers } from "../data/answers.js";
import { findBestAnswer } from "../answerLogic.js";
const router = express.Router();

// *
// * Meessage Routes
// *

// * GET
router.get("/", async (request, response) => {
  const messages = await loadMessages();

  response.json(messages);
});


// * POST
router.post("/", async (request, response) => {
  const messages = await loadMessages();
  const answers = await loadAnswers();
  const question = request.body.question;
  console.log(request.body);

  if (!question) {
    response.json({ error: "Skriv et spørgsmål" });
    return;
  }

  const message = {
    type: "question",
    text: question,
    createdAt: new Date().toISOString(),
  };
  messages.push(message);

  const result = findBestAnswer(question, answers);
  const answerMessage = {
    type: "answer",
    text: result.answer,
    createdAt: new Date().toISOString(),
  };
  messages.push(answerMessage);

  await saveMessages(messages);

  response.json({ question: message, answer: answerMessage });
});

// * Delete
router.delete("/", async (request, response) => {
  await saveMessages([]);

  response.send();
});




export default router;
