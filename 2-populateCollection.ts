import * as fs from 'fs';
import * as csv from 'csv-parse';
import weaviate from 'weaviate-client';
import { safeParseInt, safeParseFloat } from './utils/utils.ts';

interface BookProperties {
    isbn13: string;
    isbn10: string;
    title: string;
    subtitle: string;
    authors: string;
    categories: string;
    thumbnail: string;
    description: string;
    published_year: number | null;
    average_rating: number | null;
    num_pages: number | null;
    ratings_count: number | null;
}

async function populateBooks(): Promise<void> {

    const client = await weaviate.connectToLocal();
    const collectionName = 'Books';
    const booksCollection = client.collections.get(collectionName);

    const fileStream = fs.createReadStream('./dataset/7k-books-kaggle.csv');
    const parser = csv.parse({ from_line: 1 });

    const BATCH_SIZE = 500;
    const batchRecords: BookProperties[] = [];

    async function insertBatch(records: BookProperties[]): Promise<void> {

        if (records.length === 0) {
            console.log('No records to insert.');
            return;
        }
        try {
            await booksCollection.data.insertMany(records as Record<string, any>[]);
            console.log(`Successfully inserted batch of ${records.length} records.`);
        } catch (error) {
            console.error(`Errors inserting batch of records:`);
            console.error(JSON.stringify(error));
        }
    }

    try {
        fileStream.pipe(parser);

        for await (const book of parser) {
            const bookProperties: BookProperties = {
                isbn13: book[0],
                isbn10: book[1],
                title: book[2],
                subtitle: book[3],
                authors: book[4],
                categories: book[5],
                thumbnail: book[6],
                description: book[7],
                published_year: safeParseInt(book[8]),
                average_rating: safeParseFloat(book[9]),
                num_pages: safeParseInt(book[10]),
                ratings_count: safeParseInt(book[11]),
            };

            batchRecords.push(bookProperties);
            if (batchRecords.length >= BATCH_SIZE) {
                await insertBatch(batchRecords);
                batchRecords.length = 0;
            }
        }

        await insertBatch(batchRecords);
    } catch (error) {
        console.error('Error processing CSV:', error);
    } finally {
        console.log('Finished populating books.');
        client.close();
    }
}

populateBooks().catch(console.error);
