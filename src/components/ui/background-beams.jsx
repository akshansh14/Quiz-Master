// src/components/ui/background-beams.jsx
import React from "react";
import { cn } from "../../lib/utils";

export default BackgroundBeams = ({ className }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 z-0 h-full w-full bg-black opacity-25",
        className
      )}
    >
      <div className="absolute inset-0 bg-black [mask-image:radial-gradient(transparent,white)] dark:bg-black" />
    </div>
  );
};