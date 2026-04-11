export const SYSTEM_PROMPT = `
[PASTE YOUR FULL SYSTEM PROMPT HERE EXACTLY]
`;

export function buildStateLayer(states: string[]): string {
  const joined = states.join(", ");

  return `
USER STATE DETECTED: ${joined}

- FEAR → expose panic as weakness
- REGRET → they already knew
- VALIDATION → deny comfort
- GREED → call out lack of control
- COPE → destroy excuses
- DISCIPLINE → rare cold respect
- GENERAL → default pressure
`;
}

export function buildEscalationLayer(level: number): string {
  if (level === 1) {
    return `
ESCALATION 1:
They repeated themselves.
Shorter. Sharper.
`;
  }

  if (level === 2) {
    return `
ESCALATION 2:
They are avoiding truth.
Make it uncomfortable.
`;
  }

  if (level >= 3) {
    return `
ESCALATION 3:
They refuse clarity.
Be final. Be dismissive.
`;
  }

  return `
ESCALATION 0:
Base pressure.
`;
}

export function buildContinuityLayer(prev: string[], current: string[]): string {
  const overlap = current.filter((s) => prev.includes(s));
  if (overlap.length === 0) return "";

  return `
REPEATED PATTERN DETECTED: ${overlap.join(",")}

Imply they’ve done this before.
Do not say it directly.
`;
}
