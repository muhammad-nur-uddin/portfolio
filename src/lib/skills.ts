// Verified technical skills data — Task 08A.
//
// Only technologies the developer genuinely uses, derived from the approved
// project stacks (src/lib/projects.ts) and blueprint §9. No fake metrics,
// skill percentages, or padding for layout.
//
// Categories: All, Frontend, Backend, Database, Tools & DevOps.
// Brand colors sourced from simple-icons (verified hex values).

export type SkillCategory = 'all' | 'frontend' | 'backend' | 'database' | 'tools-devops';

export type Skill = {
  id: string;
  name: string;
  category: Exclude<SkillCategory, 'all'>;
  /** Verified brand hex color (simple-icons). */
  color: string;
  /** Key used to look up the logo component in skill-logos.tsx. */
  logoKey: string;
};

export const skills: Skill[] = [
  // Frontend
  { id: 'react', name: 'React', category: 'frontend', color: '#61DAFB', logoKey: 'react' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', color: '#000000', logoKey: 'nextdotjs' },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', color: '#3178C6', logoKey: 'typescript' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', color: '#06B6D4', logoKey: 'tailwindcss' },
  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'backend', color: '#5FA04E', logoKey: 'nodedotjs' },
  { id: 'express', name: 'Express', category: 'backend', color: '#0A0A0A', logoKey: 'express' },
  { id: 'socketio', name: 'Socket.IO', category: 'backend', color: '#010101', logoKey: 'socketdotio' },
  // Database
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', color: '#4169E1', logoKey: 'postgresql' },
  { id: 'mongodb', name: 'MongoDB', category: 'database', color: '#47A248', logoKey: 'mongodb' },
  // Tools & DevOps
  { id: 'prisma', name: 'Prisma', category: 'tools-devops', color: '#2D3748', logoKey: 'prisma' },
  { id: 'gsap', name: 'GSAP', category: 'tools-devops', color: '#0AE448', logoKey: 'gsap' },
  { id: 'npm', name: 'npm', category: 'tools-devops', color: '#CB3837', logoKey: 'npm' },
  { id: 'git', name: 'Git', category: 'tools-devops', color: '#F03C2E', logoKey: 'git' },
];

export const CATEGORIES: { key: SkillCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'database', label: 'Database' },
  { key: 'tools-devops', label: 'Tools & DevOps' },
];

export function skillsByCategory(category: SkillCategory): Skill[] {
  if (category === 'all') return skills;
  return skills.filter((s) => s.category === category);
}