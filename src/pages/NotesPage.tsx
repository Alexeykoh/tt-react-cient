import CanvasMap from "@/components/map";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const NotesPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Заметки</h1>
      <Card>
        <CardContent>
          <p>Страница заметок</p>
          <CanvasMap></CanvasMap>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotesPage;
