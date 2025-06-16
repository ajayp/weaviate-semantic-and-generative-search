
import weaviate, { vectorizer, generative } from 'weaviate-client';

(async () => {
  const client = await weaviate.connectToLocal();
  const collectionName = 'Books';
  await client.collections.delete(collectionName);

  const results = await client.collections.create({
    name: collectionName,
    vectorizers: vectorizer.text2VecOllama({              // Configure the Ollama embedding integration
      apiEndpoint: 'http://host.docker.internal:11434',   // Allow Weaviate from within a Docker container to connect to locally hosted Ollama instance
      model: 'nomic-embed-text',
    }),
    generative: generative.ollama({
      apiEndpoint: 'http://host.docker.internal:11434',
      model: 'llama3.2',
    }),
  });
  console.log(`Collection ${collectionName} created with Ollama vectorizer and generative model.`);
  client.close();
})();