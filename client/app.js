const API_URL = "http://localhost:3000";
const messagesContainer = document.querySelector("#messages");
const questionForm = document.querySelector("#questionForm");
const questionInput = document.querySelector("#question");
const clearMessagesButton = document.querySelector("#clearMessagesButton");

console.log(
  messagesContainer,
  questionForm,
  questionInput,
  clearMessagesButton,
);

// *
// * Function
// *

// * Display Message
function displayMessage(message) {
  const html =  `
    <article class="${message.type}">
      <p>${message.text}</p>
    </article>`;

  messagesContainer.insertAdjacentHTML("beforeend", html);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// * Get Message
async function getMessages() {
  const response = await fetch(`${API_URL}/messages`);
  const messages = await response.json();

  for (const message of messages) {
    displayMessage(message);
  }
}
getMessages();

// * Event Listener
questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  const data = await response.json();
  displayMessage(data.question);
  displayMessage(data.answer);

  questionInput.value = "";

  console.log(data);
});

// * Delete
clearMessagesButton.addEventListener("click", async () => {
  await fetch(`${API_URL}/messages`, { method: "DELETE" });
  messagesContainer.innerHTML = "";
});