import UserAvatar from "@/components/user-avatar";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import React from "react";

const parseAndHighlight = (text: string) => {
  // Находим все вхождения вида {username_1:bc008ad6-4b3b-4fbc-9bfe-1c90d4bb44c2}
  const regex = /\{(.+?):([a-f0-9-]+)\}/g;
  let lastIndex = 0;
  const parts: React.ReactNode[] = [];

  let match;
  while ((match = regex.exec(text)) !== null) {
    // Текст до совпадения
    if (match.index > lastIndex) {
      parts.push(
        <div key={`before-${lastIndex}`} className="flex gap-1 items-center">
          {text.substring(lastIndex, match.index)}
        </div>
      );
    }
    // Сам объект с name и user_id
    const name = match[1];
    // const userId = match[2];
    parts.push(
      <div key={`match-${match.index}`} className="flex gap-1 items-center">
        <UserAvatar size="xs" name={name} planId={SUBSCRIPTION.FREE} />
        <span>{name}</span>
      </div>
    );
    lastIndex = match.index + match[0].length;
  }
  // Текст после последнего совпадения
  if (lastIndex < text.length) {
    parts.push(
      <span key={`after-${lastIndex}`}>{text.substring(lastIndex)}</span>
    );
  }

  return <div className="flex gap-1 items-center flex-wrap">{parts}</div>;
};

export default parseAndHighlight;
