import { PrismaClient } from "@prisma/client";

// This function generates a report of how many times each recipe has been favorited.
// It groups the favorite records by recipeId and counts each grouping, sorting them by popularity.
export async function generateFavoritesReport(prismaClient: PrismaClient) {
    // Aggregate the counts of each favorite, grouped by recipeId
    const favoriteCounts = await prismaClient.favoriteRecipes.groupBy({
        by: ['recipeId'],
        _count: {
            recipeId: true,
        },
        orderBy: {
            _count: {
                recipeId: 'desc',
            },
        },
    });

    // Map the results to a more readable format, including the recipeId and its count
    const reportData = favoriteCounts.map(fav => ({
        recipeId: fav.recipeId,
        timesFavorited: fav._count.recipeId
    }));

    // Construct the final report object with a title, the current date-time stamp, and the data
    const report = {
        title: 'Favorites Report',
        dateGenerated: new Date().toISOString(), // Date-time stamp when the report is generated
        data: reportData
    };

    return report;
}
