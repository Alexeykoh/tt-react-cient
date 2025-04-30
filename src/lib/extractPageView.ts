import { TASKS_VIEW } from "@/app/router/routes.enum";

function extractLetterFromPath(
  path: string,
): TASKS_VIEW | null {
  // Регулярное выражение ищет /projects/ + (одна буква из t,l,b) + /
  const match = path.match(/^\/projects\/([tlb])\//);
  return match ? (match[1] as TASKS_VIEW) : null;
}

export default extractLetterFromPath;
