import express from "express";

const app = express();
const port = 3000;

const messages = [];

const answers = [
  {
    keywords: ["navn", "hedder", "hvem er du"],
    answers: ["Jeg hedder Huy. Hvad vil du ellers vide om?"],
  },
  {
    keywords: ["bor", "by", "fra"],
    answers: ["Jeg bor i Aarhus"],
  },
  {
    keywords: ["fritid", "hobby", "kan lide"],
    answers: ["I min fritid kan jeg godt lide at læse og gå ture"],
  },
];

function findAnswer(question) {
  const normalizedQuestion = question.toLowerCase();

  for (const answerGroup of answers) {
    const hasMatch = answerGroup.keywords.some((keyword) =>
      normalizedQuestion.includes(keyword),
    );

    if (hasMatch) {
      return answerGroup.answers;
    }
  }
  return "Det kender jeg ikke svaret på endnu";
}
console.log(findAnswer("Hvad hedder du?"));

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.render("index", { messages, error: "" });
});

app.post("/ask", (request, response) => {
  const question = request.body.question.trim();
  let error = "";
  if (!question) {
    error = "Skriv et spørgsmål, før du sender.";
  } else {
    messages.push({ type: "question", text: question });

    const answer = findAnswer(question);
    messages.push({ type: "answer", text: answer });
  }
  response.render("index", { messages, error });
});

// app.listen i bunden for best practice
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
