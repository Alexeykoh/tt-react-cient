import { CONTACTS_VIEW, ROUTES } from "@/app/router/routes.enum";
import { Button } from "@/components/ui/button";
import { ContactRound, Handshake } from "lucide-react";
import { useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function ContactsPage() {
  const location = useLocation();
  const currentPageView = useMemo(
    () => extractLetterFromPath(location.pathname),
    [location.pathname]
  );

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-wrap justify-between gap-2 ">
            <h1 className="text-2xl font-bold">Контакты</h1>
          </div>
          <div className="flex items-center gap-2 ">
            <Link to={`/${ROUTES.CONTACTS}/${CONTACTS_VIEW.CLIENTS}`}>
              <Button
                size={"sm"}
                variant={
                  currentPageView === CONTACTS_VIEW.CLIENTS
                    ? "outline"
                    : "ghost"
                }
              >
                <ContactRound />
                <span>Клиенты</span>
              </Button>
            </Link>
            <Link to={`/${ROUTES.CONTACTS}/${CONTACTS_VIEW.FRIENDS}`}>
              <Button
                size={"sm"}
                variant={
                  currentPageView === CONTACTS_VIEW.FRIENDS
                    ? "outline"
                    : "ghost"
                }
              >
                <Handshake />
                <span>Друзья</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default ContactsPage;

function extractLetterFromPath(path: string): CONTACTS_VIEW | null {
  const match = path.match(/^\/contacts\/([cf])(?:\/|$)/);
  return match ? (match[1] as CONTACTS_VIEW) : null;
}
