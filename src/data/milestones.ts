/**
 * Milestones - Life events and achievements with dates
 * Supports "On This Day" feature
 */

export interface Milestone {
    id: string;
    title: string;
    description: string;
    date: string; // ISO date format YYYY-MM-DD
    category: 'education' | 'career' | 'achievement' | 'project' | 'personal' | 'certification';
    icon: string;
    link?: string;
    tags?: string[];
}

export const MILESTONES: Milestone[] = [
    // Education
    {
        id: 'edu-btech-complete',
        title: 'B.Tech Completed',
        description: 'Graduated with B.Tech in Computer Science - College Topper (Rank 1)',
        date: '2024-07-15',
        category: 'education',
        icon: '🎓',
        tags: ['education', 'achievement'],
    },
    {
        id: 'edu-btech-start',
        title: 'B.Tech Started',
        description: 'Started B.Tech in Computer Science at AKTU',
        date: '2020-09-01',
        category: 'education',
        icon: '🏫',
    },
    {
        id: 'edu-jee-advanced',
        title: 'JEE Advanced Result',
        description: 'Secured AIR 11870 (Top 1%) in JEE Advanced 2020',
        date: '2020-06-15',
        category: 'achievement',
        icon: '🏆',
        tags: ['achievement', 'exam'],
    },
    {
        id: 'edu-12th-complete',
        title: 'Class 12 Completed',
        description: 'Completed Senior Secondary with 97% - School Topper',
        date: '2020-03-15',
        category: 'education',
        icon: '📚',
    },

    // Career
    {
        id: 'career-tcs-join',
        title: 'Joined TCS',
        description: 'Started as Software Engineer at Tata Consultancy Services',
        date: '2025-06-01',
        category: 'career',
        icon: '💼',
        tags: ['career', 'job'],
    },
    {
        id: 'career-qrsay-start',
        title: 'Joined QRsay',
        description: 'Started as Full Stack Developer at QRsay.com',
        date: '2023-07-01',
        category: 'career',
        icon: '🚀',
    },
    {
        id: 'career-qrsay-end',
        title: 'Left QRsay',
        description: 'Completed tenure at QRsay.com',
        date: '2025-05-31',
        category: 'career',
        icon: '👋',
    },

    // Certifications
    {
        id: 'cert-meta-backend',
        title: 'Meta Backend Developer',
        description: 'Completed Meta Backend Developer Course on Coursera',
        date: '2023-08-15',
        category: 'certification',
        icon: '📜',
        link: 'https://coursera.org',
    },

    // Projects
    {
        id: 'proj-nexusai',
        title: 'NexusAI Released',
        description: 'Released NexusAI - Multi-Agent RAG Platform',
        date: '2024-03-01',
        category: 'project',
        icon: '🤖',
        link: 'https://github.com/chirag127/NexusAI-Agentic-Workflows',
    },
    {
        id: 'proj-portfolio',
        title: 'Portfolio v2 Launched',
        description: 'Launched Project Me - Digital Twin Portfolio',
        date: '2026-02-01',
        category: 'project',
        icon: '🌐',
        link: 'https://chirag127.in',
    },
];

// Get milestones for "On This Day"
export function getOnThisDay(month: number, day: number): Milestone[] {
    return MILESTONES.filter(m => {
        const date = new Date(m.date);
        return date.getMonth() + 1 === month && date.getDate() === day;
    });
}

// Get milestones by category
export function getMilestonesByCategory(category: Milestone['category']): Milestone[] {
    return MILESTONES.filter(m => m.category === category);
}

// Get milestones by year
export function getMilestonesByYear(year: number): Milestone[] {
    return MILESTONES.filter(m => new Date(m.date).getFullYear() === year);
}

// Get recent milestones
export function getRecentMilestones(count: number = 5): Milestone[] {
    return [...MILESTONES]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, count);
}

export default MILESTONES;
