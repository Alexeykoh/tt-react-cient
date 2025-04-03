import React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";

interface DropdownMenuComponentProps {
  onEdit: () => void;
  onDelete: () => void;
}

const DropdownMenuComponent: React.FC<DropdownMenuComponentProps> = ({ onEdit, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className="flex size-8 text-muted-foreground data-[state=open]:bg-muted ml-auto"
          size="icon"
        >
          <MoreVerticalIcon />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onEdit}>
          <PencilIcon className="mr-2 size-4" />
          <span>Редактировать</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
          <TrashIcon className="mr-2 size-4" />
          <span>Удалить</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownMenuComponent;
