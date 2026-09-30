import express from "express";
import fs from "node:fs/promises";

const app = express();
const port = 3000;
const answers = [
  {
    category: "navn",
    keywords: ["navn", "hedder", "hvem er du"],
    answer: ["Jeg hedder Huy. Hvad vil du ellers vide om?"],
  },
  {
    category: "bosted",
    keywords: ["bor", "by", "fra"],
    answer: ["Jeg bor i Aarhus"],
  },
  {
    category: "hobby",
    keywords: ["fritid", "hobby", "kan lide"],
    answer: ["I min fritid kan jeg godt lide at læse og gå ture"],
  },
];

const topicStats = {
  navn: 0,
  bosted: 0,
  hobby: 0,
};

async function loadMessages() {
  const data = await fs.readFile("./data/messages.json", "utf8");
  const messages = JSON.parse(data);
  return messages;
}

async function saveMessages(messages) {
  const messageJson = JSON.stringify(messages, null, 2);
  await fs.writeFile("./data/messages.json", messageJson);
}

async function loadAnswers() {
 const data = await fs.readFile("./data/answers.json", "utf8");
  return JSON.parse(data);
}

async function saveAnswers(answers) {
  const json = JSON.stringify(answers, null, 2);
  await fs.writeFile("./data/answers.json", json);
}

// function matchesKeywords(keywords, normalizedQuestion) {
//   const matches = keywords;
// }

function countMatches(keywords, normalizedQuestion) {
  const matches = keywords.filter((keyword) => {
    return normalizedQuestion.includes(keyword);
  });

  return matches.length;
}

function findBestAnswer(question) {
  const normalizedQuestion = question.toLowerCase();
  let bestScore = 0;
  let bestAnswer =
    "123Det kender jeg ikke svaret på endnu BestAnswerFunction123";
  let bestCategory = "";

  for (const answerGroup of answers) {
    // 1. Beregn denne regels score.
    const score = countMatches(answerGroup.keywords, normalizedQuestion);
    // 2. Sammenlign med bestScore.
    if (score > bestScore) {
      bestScore = score;
      // 3. Gem score og svar, hvis reglen er bedre.
      bestAnswer = answerGroup.answer;
      bestCategory = answerGroup.category;
    }
  }
  return {
    answer: bestAnswer,
    category: bestCategory,
  };
}


app.use(express.json());

app.get("/messages", async (request, response) => {
  const messages = await loadMessages();

  response.json(messages);
});

app.get("/answers", async (request, response) => {
  const answers = await loadAnswers();

  response.json(answers);
});

app.post("/messages", async (request, response) => {
  const messages = await loadMessages();
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

  const result = findBestAnswer(question);
  const answerMessage = {
    type: "answer",
    text: result.answer,
    createdAt: new Date().toISOString(),
  };
  messages.push(answerMessage);

  await saveMessages(messages);

  response.json({ question: message, answer: answerMessage });
});

app.post("/answers", async (request, response) => {
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

app.put("/answers/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === request.params.category);

  answerRule.keywords = request.body.keywords;
  answerRule.answer = request.body.answer;
  await saveAnswers(answers);

  response.json(answerRule);
});

app.delete("/messages", async (request, response) => {
  await saveMessages([]);

  response.send();
});

app.delete("/answers/:category", async (request, response) => {
  const answers = await loadAnswers();
  const updatedAnswers = answers.filter((a) => a.category !== request.params.category);

  await saveAnswers(updatedAnswers);

  response.send();
});

//* app.listen i bunden for best practice
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
