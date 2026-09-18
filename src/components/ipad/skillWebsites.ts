export const skillWebsites: Record<string, string> = {
  nest: "https://nestjs.com",
  nestjs: "https://nestjs.com",
  node: "https://nodejs.org",
  nodejs: "https://nodejs.org",
  express: "https://expressjs.com",
  expressjs: "https://expressjs.com",
  typescript: "https://www.typescriptlang.org",
  javascript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  python: "https://www.python.org",
  go: "https://go.dev",
  golang: "https://go.dev",
  react: "https://react.dev",
  vue: "https://vuejs.org",
  vuejs: "https://vuejs.org",
  next: "https://nextjs.org",
  nextjs: "https://nextjs.org",
  tailwind: "https://tailwindcss.com",
  tailwindcss: "https://tailwindcss.com",
  html: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  html5: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  css: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  css3: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  sass: "https://sass-lang.com",
  vite: "https://vite.dev",
  graphql: "https://graphql.org",
  api: "https://restfulapi.net",
  restapi: "https://restfulapi.net",
  prisma: "https://www.prisma.io",
  postgres: "https://www.postgresql.org",
  postgresql: "https://www.postgresql.org",
  mysql: "https://www.mysql.com",
  mongo: "https://www.mongodb.com",
  mongodb: "https://www.mongodb.com",
  redis: "https://redis.io",
  sqlite: "https://www.sqlite.org",
  elastic: "https://www.elastic.co",
  elasticsearch: "https://www.elastic.co",
  docker: "https://www.docker.com",
  kube: "https://kubernetes.io",
  kubernetes: "https://kubernetes.io",
  k8s: "https://kubernetes.io",
  linux: "https://www.kernel.org",
  nginx: "https://nginx.org",
  git: "https://git-scm.com",
  github: "https://github.com",
  cicd: "https://about.gitlab.com/topics/ci-cd/",
  aws: "https://aws.amazon.com",
  cloudflare: "https://www.cloudflare.com",
  kafka: "https://kafka.apache.org",
  rabbitmq: "https://www.rabbitmq.com",
  websocket: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
  websockets: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
  safari: "https://www.google.com",
};

export function getSkillWebsite(skill: {
  name: string;
  icon?: string;
  url?: string;
  website?: string;
}): string {
  if (skill.url) return skill.url;
  if (skill.website) return skill.website;

  const key = (skill.icon || skill.name).toLowerCase().replace(/[\s._-]/g, "");
  if (skillWebsites[key]) return skillWebsites[key];

  for (const [k, url] of Object.entries(skillWebsites)) {
    if (key.includes(k)) return url;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(skill.name + " documentation")}`;
}
