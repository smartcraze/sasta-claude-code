// Keeping track of conversation history in a simplified format for now.
// Gemini SDK manages history internally in chat session, but we might want to persist it.

import type { Content } from "@google/generative-ai";

export class ContextManager {
  private history: Content[] = [];

  constructor() {}

  public getHistory(): Content[] {
    return this.history;
  }

  public add(content: Content) {
    this.history.push(content);
  }
}
