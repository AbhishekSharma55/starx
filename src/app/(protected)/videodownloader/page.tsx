"use client";
import React from "react";
import { z } from "zod";
import { TextGenerateEffect } from "@/components/text-generate-effect";
import { InstagramVideoForm } from "@/features/instagram/components/form";

const formSchema = z.object({
  postUrl: z.string().url({
    message: "Provide a valid Instagram post link",
  }),
});

export default function VideoDownloadPage() {

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="mx-auto max-w-2xl space-y-6 py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-2 text-center">
          <TextGenerateEffect words="Video Downloader" />
          <p className="text-muted-foreground">
            Enter a YouTube or Instagram video URL to download the video.
          </p>
        </div>
        <InstagramVideoForm />
      </div>
    </div>
  );
}
