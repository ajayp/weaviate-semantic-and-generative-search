import weaviate from 'weaviate-client';
import readline from 'node:readline';
import { once } from 'node:events';


async function semanticSearch(): Promise<void> {
    let client;
    try {
        client = await weaviate.connectToLocal();
        console.log('Successfully connected to Weaviate.');
        const collectionName = 'Books';
        const booksCollection = client.collections.get(collectionName);

        process.stdout.write("Describe the book you're looking for (e.g., genre, plot, themes), or hit return for the default query: ");
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const [userInput] = await once(rl, 'line');
        rl.close();

        try {
            const userQuery = userInput.trim() || 'I want a space based story about heroes, villains, rebels, and tyrants, with pedal-bin droids.'; // D
            const responses = await booksCollection.query.nearText(
                userQuery,
                {
                    limit: 3,
                    returnProperties: ['title', 'authors', 'description', 'average_rating', 'categories'],
                }
            );

            console.log('\nRecommendations:\n');
            for (const response of responses.objects) {
                console.log(`Title: ${response.properties.title ?? 'N/A'}`);
                console.log(`Description: ${response.properties.description ?? 'N/A'}`);
                console.log(`Average Rating: ${response.properties.average_rating ?? 'N/A'}`);
                console.log(`Category: ${response.properties.categories ?? 'N/A'}`);
                console.log('\n');
            }
        } catch (queryError) {
            console.error('Error during search query:', queryError);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        if (client) {
            await client.close();
            console.log('Weaviate client closed.');
        }
    }
}

semanticSearch().catch(console.error);