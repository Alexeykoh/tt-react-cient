import { Button } from "./ui/button";
import { LoaderCircle, Pause, Play } from "lucide-react";

interface Props {
  isPlay: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export default function PlayPauseButton({
  isPlay,
  isLoading,
  onClick,
}: Props) {
  return (
    <Button
      className={!isPlay ? "bg-emerald-400" : "bg-rose-400"}
      onClick={() => {
        if (!isLoading) {
          onClick();
        }
      }}
    >
      {isLoading ? (
        <LoaderCircle className="animate-spin" />
      ) : !isPlay ? (
        <Play />
      ) : (
        <Pause />
      )}
    </Button>
  );
}
