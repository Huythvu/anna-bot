import express from "express";

const app = express();
const port = 3000;

const messages = [];

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

console.log(findBestAnswer("Hvad hedder du?"));
console.log(findBestAnswer("Kan du bage en kage?"));

// function findAnswer(question) {
//   const normalizedQuestion = question.toLowerCase();

//   for (const answerGroup of answers) {
//     const hasMatch = answerGroup.keywords.some((keyword) =>
//       normalizedQuestion.includes(keyword),
//     );

//     if (hasMatch) {
//       return answerGroup.answer;
//     }
//   }
//   return "Det kender jeg ikke svaret på endnu";
// }
// // console.log(findAnswer("Hvad hedder du?"));

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.render("index", { messages, error: "", topicStats });
});

app.post("/ask", (request, response) => {
  const question = request.body.question.trim();
  let error = "";
  if (!question) {
    error = "Skriv et spørgsmål, før du sender.";
  } else {
    messages.push({ type: "question", text: question });

    const result = findBestAnswer(question);
    messages.push({ type: "answer", text: result.answer });
    if (result.category) {
      topicStats[result.category] += 1;
    }
    console.log(topicStats);
  }
  response.render("index", { messages, error, topicStats});
});

//* app.listen i bunden for best practice
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
