// src/services/opportunities.js
import axios from 'axios';
import * as Secrets from '../config/secrets';

export const fetchJobs = async (query, category = 'Tümü') => {
    try {
        const response = await axios.post(`https://${Secrets.RAPID_API_HOST}/getjobs`,
            {
                search_term: `${query} in Istanbul, Turkey`,
                location: 'Istanbul',
                results_wanted: 10,
                site_name: ['linkedin', 'glassdoor'],
                distance: 25,
                date_posted: 'month'
            },
            {
                headers: {
                    'x-rapidapi-key': Secrets.RAPID_API_KEY,
                    'x-rapidapi-host': Secrets.RAPID_API_HOST,
                    'Content-Type': 'application/json'
                }
            }
        );
        const rawJobs = response.data.jobs || [];
        return rawJobs.map(item => ({
            id: item.id || Math.random().toString(),
            title: item.title,
            company: item.company,
            location: item.location || 'İstanbul',
            type: category === 'Staj' ? 'STAJ' : 'İŞ',
            logoUrl: item.company_url || 'https://cdn-icons-png.flaticon.com/512/3800/3800581.png',
            postedAt: item.date_posted || 'Yeni',
            link: item.job_url || item.url
        }));
    } catch (error) {
        console.error("Jobs API Hatası:", error);
        return [];
    }
};

export const fetchEvents = async (query) => {
    try {
        console.log(`🎉 EVENTS İSTEĞİ: "${query}"`);
        const url = `https://serpapi.com/search.json?engine=google_events&q=${encodeURIComponent(query)}&api_key=${Secrets.SERP_API_KEY}`;
        const response = await fetch(url);
        const json = await response.json();

        const rawEvents = json.events_results || [];
        console.log(`✅ ${rawEvents.length} ETKİNLİK BULUNDU.`);

        return rawEvents.map(item => ({
            id: item.link || Math.random().toString(),
            title: item.title,
            company: item.venue?.name || 'Organizasyon',
            location: item.address ? item.address.join(', ') : 'İstanbul',
            type: 'ETKİNLİK',
            logoUrl: item.thumbnail || 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png',
            postedAt: item.date?.when || 'Yakında',
            link: item.link
        }));
    } catch (error) {
        console.error("Events API Hatası:", error);
        return [];
    }
};