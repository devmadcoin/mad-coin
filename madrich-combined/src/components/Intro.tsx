import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Intro() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink"
        >
          <motion.img
            src="/mad-logo.png"
            alt=""
            initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="h-28 w-28 drop-shadow-[0_0_40px_rgba(234,32,34,0.6)]"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.4, 1] }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="absolute bottom-1/3 font-display text-2xl uppercase tracking-[0.3em] text-mad"
          >
            Stay $MAD
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
