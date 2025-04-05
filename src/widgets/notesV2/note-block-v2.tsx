import { BlockType, BlockV2 } from "./note-editor-v2";
import { ChangeEvent, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";

export interface NoteBlockProps {
  block: BlockV2;
  onChange: (id: string, parentIds: Array<string>, value: string) => void;
  onEnter: (id: string, parentIds: Array<string>, referenceType: BlockType) => void;
  onDelete: (id: string, parentIds: Array<string>) => void;
  onTab: (id: string, parentIds: Array<string>) => void;
}

export function NoteBlockV2(props: NoteBlockProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      props.onTab(props.block.id, props.block.parentIds || []);
    }
    if (e.key === "Backspace" && !props.block.content.length) {
      e.preventDefault();
      props.onDelete(props.block.id, props.block.parentIds || []);
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      props.onEnter(props.block.id, props.block.parentIds || [], props.block.type);
    }
  };

  return (
    <div className="pl-4" style={{ marginLeft: props.block.parentIds?.length ? `${props.block.parentIds.length * 20}px` : '0' }}>
      <Input
        autoFocus={props.block.isFocused}
        style={{
          padding: "0",
          paddingLeft: "5px",
          border: "none",
          outline: "unset",
          fontWeight: props.block.type === "heading1" ? "bold" : "normal",
          fontSize: props.block.type === "heading1" ? "1.5em" : "1em",
        }}
        onKeyDown={handleKeyDown}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          props.onChange(props.block.id, props.block.parentIds || [], e.target.value);
        }}
        className="w-full resize-none hover:bg-sky-50/10 focus:bg-sky-50/10"
        value={props.block.content}
      />
      {props.block.children.map(child => (
        <NoteBlockV2
          key={child.id}
          block={child}
          onChange={props.onChange}
          onEnter={props.onEnter}
          onDelete={props.onDelete}
          onTab={props.onTab}
        />
      ))}
    </div>
  );
}