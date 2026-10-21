// src/hooks/usePreWarm.ts
import { useEffect, useState } from "react";

/**
 * Pre‑loads a list of image URLs, eagerly loads a lazy component (if any),
 * and runs an optional warm‑up callback.
 *
 * Returns `true` when every resource has resolved.
 */
export function usePreWarm(
  imageUrls: readonly string[],
  lazyComponent?: () => Promise<unknown>,
  warmup?: () => void
) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 1️⃣ Load images
    const imgPromises = imageUrls.map(
      src =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => reject(`Failed to load ${src}`);
        })
    );

    // 2️⃣ Pre‑fetch lazy chunk
    const componentPromise = lazyComponent ? lazyComponent() : Promise.resolve();

    // 3️⃣ Warm‑up callback – run in an idle slot so it never blocks UI
    const warmupPromise = warmup
      ? Promise.resolve().then(() => {
          (window as any).requestIdleCallback?.(() => warmup());
        })
      : Promise.resolve();

    // 4️⃣ Resolve when everything is done
    Promise.all([...imgPromises, componentPromise, warmupPromise])
      .then(() => setReady(true))
      .catch(err => {
        console.warn("[pre‑warm] some resource failed:", err);
        // Still unblock the UI – the missing asset will just load later.
        setReady(true);
      });
  }, [imageUrls, lazyComponent, warmup]);

  return ready;
}
