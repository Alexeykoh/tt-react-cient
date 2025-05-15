import { Button } from "./ui/button";
import { LoaderCircle, Pause, Play } from "lucide-react";

interface Props {
  isPlay: boolean;
  isLoading: boolean;
  onClick: () => void;
  variant: "button" | "icon";
  className?: string;
}

export default function PlayPauseButton({
  isPlay,
  isLoading,
  onClick,
  variant,
  className,
}: Props) {
  return (
    <Button
      size={"icon"}
      variant={"outline"}
      className={`${!isPlay ? "text-emerald-400" : "text-orange-400"} ${variant === "icon" && "size-6"} active:scale-90 duration-150 ${className ?? ""}`}
      onClick={() => {
        if (!isLoading) {
          onClick();
        }
      }}
    >
      {isLoading ? (
        <LoaderCircle
          className={`animate-spin ${variant === "icon" && "size-3"}`}
        />
      ) : !isPlay ? (
        <Play className={`${variant === "icon" && "size-3"}`} />
      ) : (
        <Pause className={`animate-pulse ${variant === "icon" && "size-3"}`} />
      )}
    </Button>
  );
}
