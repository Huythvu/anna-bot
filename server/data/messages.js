import fs from "node:fs/promises";

// *
// * message Functions
// *

export async function loadMessages() {
  const data = await fs.readFile("./data/messages.json", "utf8");
  const messages = JSON.parse(data);
  return messages;
}

export async function saveMessages(messages) {
  const messageJson = JSON.stringify(messages, null, 2);
  await fs.writeFile("./data/messages.json", messageJson);
}