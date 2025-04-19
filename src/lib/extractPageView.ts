import { VIEW_ROUTES } from "@/app/router/routes.enum";

function extractLetterFromPath(path: string): VIEW_ROUTES | null {
  // Регулярное выражение ищет /projects/ + (одна буква из t,l,b) + /
  const match = path.match(/^\/projects\/([tlb])\//);
  return match ? match[1] as VIEW_ROUTES : null;
}

export default extractLetterFromPath;
