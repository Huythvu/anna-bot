// *
// * Find Best Answer
// *

export function countMatches(keywords, normalizedQuestion) {
  const matches = keywords.filter((keyword) => {
    return normalizedQuestion.includes(keyword);
  });

  return matches.length;
}

export function findBestAnswer(question, answers) {
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

export function matchesKeywords(keywords, normalizedQuestion) {
  const matches = keywords;
}


