// src/utils/searchLogic.ts

export const TOPIC_DICTIONARY: any = {
    'Yazılım': { job: 'Software Engineer', event: 'Technology Events' },
    
    'Tasarım': { job: 'UI UX Designer', event: 'Art and Design Exhibitions' },
    'Yapay Zeka': { job: 'AI Engineer', event: 'Artificial Intelligence Events' },
    'Oyun Geliş.': { job: 'Game Developer', event: 'Game Development Meetups' },
    'Girişim': { job: 'Startup Operations', event: 'Startup Summits' },
    'Veri Bilimi': { job: 'Data Scientist', event: 'Data Science and AI Events' },
    'Siber Güv.': { job: 'Cyber Security Analyst', event: 'Cyber Security Events' },
    'Web3': { job: 'Blockchain Developer', event: 'Web3 and Blockchain Events' },
    'Pazarlama': { job: 'Digital Marketing', event: 'Business Networking and Marketing' }
};

export const buildSearchQuery = (category: string, topic: string) => {
    const terms = TOPIC_DICTIONARY[topic] || TOPIC_DICTIONARY['Yazılım'];
    
    if (category.includes('Etkinlik')) {
        return `${terms.event} in Istanbul`; 
    }
    return terms.job;
};