"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Exercise } from "@/lib/exercises/data";
import {
  getDefaultImageKey,
  getExerciseImageUrl,
  getExerciseImageAlt,
} from "@/lib/exercises/media";

interface ExerciseImageProps {
  exercise: Exercise;
  size: "thumbnail" | "detail";
  className?: string;
}

const SIZES = {
  thumbnail: { width: 40, height: 40, cls: "h-10 w-10 rounded-xl" },
  detail: { width: 800, height: 600, cls: "w-full aspect-[4/3] rounded-2xl" },
};

export default function ExerciseImage({ exercise, size, className }: ExerciseImageProps) {
  const [error, setError] = useState(false);
  const key = getDefaultImageKey(exercise);
  const url = getExerciseImageUrl(key);
  const alt = getExerciseImageAlt(key);
  const dim = SIZES[size];

  if (!url || error) {
    return (
      <div
        className={`${dim.cls} flex items-center justify-center shrink-0 ${className ?? ""}`}
        style={{ background: "rgba(196,149,106,0.06)" }}
      >
        <div
          className="h-full w-full rounded-[inherit]"
          style={{
            background: "linear-gradient(135deg, rgba(196,149,106,0.08) 0%, rgba(196,149,106,0.02) 100%)",
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`${dim.cls} overflow-hidden shrink-0 ${className ?? ""}`}
      style={{ background: "rgba(196,149,106,0.06)" }}
    >
      <Image
        src={url}
        alt={alt}
        width={dim.width}
        height={dim.height}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => setError(true)}
      />
    </motion.div>
  );
}
