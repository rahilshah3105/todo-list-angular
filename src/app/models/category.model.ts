export interface Category {
    id: string;
    name: string;
    icon: string; // CSS class or SVG path identifier
    type: 'system' | 'custom';
}
