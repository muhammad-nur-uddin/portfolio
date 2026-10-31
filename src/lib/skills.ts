// Verified technical skills data — Task 08A-10.
export type SkillCategory =
  | 'all'
  | 'languages'
  | 'frontend'
  | 'backend'
  | 'databases-orm'
  | 'tools-devops'
  | 'ai'
  | 'architecture';

export type Skill = {
  id: string;
  name: string;
  category: Exclude<SkillCategory, 'all'>;
  color: string;
  logoKey: string;
};

export const skills: Skill[] = [
  { id: 'typescript', name: 'TypeScript', category: 'languages', color: '#3178C6', logoKey: 'typescript' },
  { id: 'javascript', name: 'JavaScript', category: 'languages', color: '#F7DF1E', logoKey: 'javascript' },
  { id: 'sql', name: 'SQL', category: 'languages', color: '#4169E1', logoKey: 'sql' },
  { id: 'html5', name: 'HTML5', category: 'languages', color: '#E34F26', logoKey: 'html5' },
  { id: 'css3', name: 'CSS3', category: 'languages', color: '#1572B6', logoKey: 'css3' },
  { id: 'react', name: 'React', category: 'frontend', color: '#61DAFB', logoKey: 'react' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', color: '#000000', logoKey: 'nextdotjs' },
  { id: 'reduxtoolkit', name: 'Redux Toolkit', category: 'frontend', color: '#764ABC', logoKey: 'reduxtoolkit' },
  { id: 'zustand', name: 'Zustand', category: 'frontend', color: '#8B7355', logoKey: 'zustand' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', color: '#06B6D4', logoKey: 'tailwindcss' },
  { id: 'shadcnui', name: 'shadcn/ui', category: 'frontend', color: '#000000', logoKey: 'shadcnui' },
  { id: 'gsap', name: 'GSAP', category: 'frontend', color: '#0AE448', logoKey: 'gsap' },
  { id: 'nodejs', name: 'Node.js', category: 'backend', color: '#5FA04E', logoKey: 'nodedotjs' },
  { id: 'express', name: 'Express.js', category: 'backend', color: '#0A0A0A', logoKey: 'express' },
  { id: 'restapis', name: 'REST APIs', category: 'backend', color: '#2563EB', logoKey: 'restapis' },
  { id: 'socketio', name: 'Socket.IO', category: 'backend', color: '#010101', logoKey: 'socketdotio' },
  { id: 'jwt', name: 'JWT', category: 'backend', color: '#7C3AED', logoKey: 'jwt' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'databases-orm', color: '#4169E1', logoKey: 'postgresql' },
  { id: 'mongodb', name: 'MongoDB', category: 'databases-orm', color: '#47A248', logoKey: 'mongodb' },
  { id: 'prisma', name: 'Prisma ORM', category: 'databases-orm', color: '#FFFFFF', logoKey: 'prisma' },
  { id: 'gitgithub', name: 'Git & GitHub', category: 'tools-devops', color: '#F03C2E', logoKey: 'git' },
  { id: 'postman', name: 'Postman', category: 'tools-devops', color: '#FF6C37', logoKey: 'postman' },
  { id: 'vercel', name: 'Vercel', category: 'tools-devops', color: '#000000', logoKey: 'vercel' },
  { id: 'render', name: 'Render', category: 'tools-devops', color: '#46E3B7', logoKey: 'render' },
  { id: 'cloudinary', name: 'Cloudinary', category: 'tools-devops', color: '#3448C5', logoKey: 'cloudinary' },
  { id: 'docker', name: 'Docker', category: 'tools-devops', color: '#2496ED', logoKey: 'docker' },
  { id: 'redis', name: 'Redis', category: 'tools-devops', color: '#DC382D', logoKey: 'redis' },
  { id: 'aws', name: 'AWS', category: 'tools-devops', color: '#232F3E', logoKey: 'aws' },
  { id: 'cicd', name: 'CI/CD', category: 'tools-devops', color: '#16A34A', logoKey: 'cicd' },
  { id: 'langchain', name: 'LangChain', category: 'ai', color: '#1C3C3C', logoKey: 'langchain' },
  { id: 'langgraph', name: 'LangGraph', category: 'ai', color: '#1C3C3C', logoKey: 'langgraph' },
  { id: 'rag', name: 'RAG', category: 'ai', color: '#7C3AED', logoKey: 'rag' },
  { id: 'vectordb', name: 'Vector DB', category: 'ai', color: '#0369A1', logoKey: 'vectordb' },
  { id: 'systemdesign', name: 'System Design', category: 'architecture', color: '#4169E1', logoKey: 'systemdesign' },
];

export const CATEGORIES: { key: SkillCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'languages', label: 'Languages' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'databases-orm', label: 'Databases & ORM' },
  { key: 'tools-devops', label: 'Tools & DevOps' },
  { key: 'ai', label: 'AI' },
  { key: 'architecture', label: 'Architecture' },
];

export function skillsByCategory(category: SkillCategory): Skill[] {
  if (category === 'all') return skills;
  return skills.filter((s) => s.category === category);
}
