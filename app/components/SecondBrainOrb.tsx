'use client';

import { motion } from 'framer-motion';

const SECOND_BRAIN_URL = process.env.NEXT_PUBLIC_SECOND_BRAIN_URL || 'obsidian://open';

export default function SecondBrainOrb() {
  return (
    <a
      href={SECOND_BRAIN_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
      title="Open second brain"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(96,165,250,0.95), rgba(59,130,246,0.2) 45%, rgba(124,58,237,0.18) 70%, rgba(245,158,11,0.1) 100%)',
          boxShadow: '0 0 24px rgba(59,130,246,0.35), inset 0 0 18px rgba(255,255,255,0.12)',
          border: '1px solid rgba(96,165,250,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ fontSize: 24, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.35))' }}>🧠</div>
      </motion.div>
    </a>
  );
}
