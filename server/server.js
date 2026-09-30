import express from "express";
import messagesRouter from "./routes/messages.js"
import answersRouter from "./routes/answers.js"


const app = express();
const port = 3000;

app.use(express.json());
app.use("/messages", messagesRouter)
app.use("/answers", answersRouter)
// const answers = [
//   {
//     category: "navn",
//     keywords: ["navn", "hedder", "hvem er du"],
//     answer: ["Jeg hedder Huy. Hvad vil du ellers vide om?"],
//   },
//   {
//     category: "bosted",
//     keywords: ["bor", "by", "fra"],
//     answer: ["Jeg bor i Aarhus"],
//   },
//   {
//     category: "hobby",
//     keywords: ["fritid", "hobby", "kan lide"],
//     answer: ["I min fritid kan jeg godt lide at læse og gå ture"],
//   },
// ];

// const topicStats = {
//   navn: 0,
//   bosted: 0,
//   hobby: 0,
// };


//* app.listen i bunden for best practice
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
