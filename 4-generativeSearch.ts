import weaviate from 'weaviate-client';
import readline from 'node:readline';
import { once } from 'node:events';

async function generativeSearch(): Promise<void> {
    let client;
    try {
        client = await weaviate.connectToLocal();
        console.log('Successfully connected to Weaviate.');
        const collectionName = 'Books';
        const booksCollection = client.collections.get(collectionName);

        process.stdout.write('Describe the book you are looking for (e.g., genre, plot, themes), or hit return for the default query:');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const [userInput] = await once(rl, 'line');
        rl.close();

        try {
            const userQuery = userInput.trim() || 'I want a space based story about heroes, villains, rebels, and tyrants, with pedal-bin droids.'; // Default if no input is provided
            console.log(`Searching for books related to: ${userQuery}, please wait...`);
            const responses = await booksCollection.generate.nearText(
                userQuery,
                {
                    singlePrompt: `Explain why this book might appeal to them. The book's title is {title}, with a description: {description}, and is in the genre: {categories}.`
                },
                {
                    limit: 4
                }
            );

            console.log(`\nRecommendations based on your interest:\n`);
            for (const response of responses.objects) {
                console.log(`${response.generative?.text}`);
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

generativeSearch().catch(console.error);