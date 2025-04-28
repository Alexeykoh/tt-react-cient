import { Button } from "./ui/button";
import { LoaderCircle, Pause, Play } from "lucide-react";

interface Props {
  isPlay: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export default function PlayPauseButton({ isPlay, isLoading, onClick }: Props) {
  return (
    <Button
      size={"icon"}
      variant={"outline"}
      className={`${!isPlay ? "text-emerald-400" : "text-orange-400"} active:scale-90 duration-150`}
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
        <Pause className="animate-pulse" />
      )}
    </Button>
  );
}
