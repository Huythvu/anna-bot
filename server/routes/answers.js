import express from "express";
import { loadAnswers, saveAnswers } from "../data/answers.js";
const router = express.Router();

// *
// * Answer Routes
// *

// * GET
router.get("/", async (request, response) => {
    const answers = await loadAnswers();
    
    response.json(answers);
});

// * GET category
router.get("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answer = answers.find(
    (a) => a.category === request.params.category,
  );

  response.json(answer);
});


// * POST
router.post("/", async (request, response) => {
    const answers = await loadAnswers();
    const newAnswerRule = {
        category: request.body.category,
        keywords: request.body.keywords,
        answer: request.body.answer
  };

  answers.push(newAnswerRule);
  await saveAnswers(answers);
  
  response.json(newAnswerRule);
});

// * PUT
router.put("/:category", async (request, response) => {
    const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === request.params.category);

  answerRule.keywords = request.body.keywords;
  answerRule.answer = request.body.answer;
  await saveAnswers(answers);

  response.json(answerRule);
});

// * DELETE
router.delete("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const updatedAnswers = answers.filter((a) => a.category !== request.params.category);

  await saveAnswers(updatedAnswers);

  response.send();
});

export default router;