// src/utils/uiHelpers.ts

const PREMIUM_PALETTES = [
    { bg: '#DBEAFE', text: '#1E40AF' }, 
    { bg: '#FCE7F3', text: '#9D174D' }, 
    { bg: '#D1FAE5', text: '#065F46' }, 
    { bg: '#FEF3C7', text: '#92400E' }, 
    { bg: '#E0E7FF', text: '#3730A3' }, 
    { bg: '#F3F4F6', text: '#374151' }, 
];

export const getAvatarStyle = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % PREMIUM_PALETTES.length);
    return PREMIUM_PALETTES[index];
};

export const getInitials = (name: string) => {
    if (!name) return "?";
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials.slice(0, 2);
};