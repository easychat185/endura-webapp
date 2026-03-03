"use client";

import { useCallback } from "react";
import type { ExerciseStep } from "@/lib/exercises/data";
import { getStepAudioUrl } from "@/lib/exercises/media";
import { useTTS } from "./useTTS";
import { useAudioPlayer } from "./useAudioPlayer";

export function useGuidedAudio() {
  const tts = useTTS();
  const audio = useAudioPlayer();

  const isPlaying = tts.isSpeaking || audio.isPlaying;

  const playStep = useCallback(
    (step: ExerciseStep) => {
      // Stop any current playback
      tts.stop();
      audio.stop();

      if (step.audioUrl) {
        // Pre-recorded audio takes priority
        audio.play(getStepAudioUrl(step.audioUrl));
      } else {
        // Fall back to TTS
        tts.speak(step.instruction);
      }
    },
    [tts, audio]
  );

  const stopAudio = useCallback(() => {
    tts.stop();
    audio.stop();
  }, [tts, audio]);

  const pauseAudio = useCallback(() => {
    tts.pause();
    audio.pause();
  }, [tts, audio]);

  const resumeAudio = useCallback(() => {
    tts.resume();
    audio.resume();
  }, [tts, audio]);

  return { playStep, stopAudio, pauseAudio, resumeAudio, isPlaying };
}
