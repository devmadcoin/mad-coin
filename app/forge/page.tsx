"use client";

import { useState } from "react";

const BASE = "/pfp/base/base-01.png";
const BG = "/pfp/bg/bg-redclouds.png";

const EYES = [
  "cartoon-common-black.png",
  "cartoon-common-blue.png",
  "cartoon-common-green.png",
  "cartoon-common-orange.png",
  "cartoon-common-purple.png",
  "cartoon-common-red.png",
];

const ACCESSORIES = [
  "/pfp/accessories/cartoon/rare/cartoon-rare-cowboyhat.png",
  "/pfp/accessories/cartoon/rare/cartoon-rare-energydrink.png",
  "/pfp/accessories/cartoon/rare/cartoon-rare-greencandle.png",
];

export default function Forge() {
  const [eyeIndex, setEyeIndex] = useState(0);
  const [accessoryIndex, setAccessoryIndex] = useState(0);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-black mb-8">$MAD Forge</h1>

      <div className="relative w-72 h-72">
        {/* Background */}
        <img src={BG} className="absolute inset-0 w-full h-full object-cover rounded-3xl" />

        {/* Base */}
        <img src={BASE} className="absolute inset-0 w-full h-full object-contain" />

        {/* Eyes */}
        <img
          src={`/pfp/eyes/cartoon/common/${EYES[eyeIndex]}`}
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Accessory */}
        <img
          src={ACCESSORIES[accessoryIndex]}
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setEyeIndex((eyeIndex + 1) % EYES.length)}
          className="px-4 py-2 bg-white text-black rounded-xl font-bold"
        >
          Change Eyes
        </button>

        <button
          onClick={() => setAccessoryIndex((accessoryIndex + 1) % ACCESSORIES.length)}
          className="px-4 py-2 bg-white text-black rounded-xl font-bold"
        >
          Change Accessory
        </button>
      </div>
    </main>
  );
}
