/**
 * Interfaces encapsulate and enforce the structure of recipe data objects,
 * ensuring consistent data integrity across the application.
 */

export interface Recipe {
    id: number;
    title: string;
    image: string;
    imageType: string;
}

export interface RecipeSummary {
    id: number;
    title: string;
    summary: string;
}