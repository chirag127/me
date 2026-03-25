export async function getProjects(): Promise<string> {
  // Normally imports from ../../../data/resume 
  return `Chirag's Projects:
- Chirag Singhal: Personal Digital Identity Operating System built with Astro & React.
- Advanced AI integrations: LangGraph browser-side orchestration.`;
}

export async function getSkills(): Promise<string> {
  // Normally imports from ../../../data/resume 
  return `Chirag's Skills:
- Languages: TypeScript, JavaScript, Python
- Frontend: React, Astro, Tailwind CSS, Framer Motion
- Backend: Firebase, Node.js
- AI: Puter.js, LangChain, LLMs`;
}
