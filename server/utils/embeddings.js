import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { v4 as uuidv4 } from "uuid";

class Embedder {
  // Initialize the pipeline
  async init() {
    // const { pipeline } = await import("@xenova/transformers");
    // this.pipe = await pipeline("embeddings", new OpenAIEmbeddings());
  }

  sliceIntoChunks = (arr, chunkSize) => {
    return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
      arr.slice(i * chunkSize, (i + 1) * chunkSize)
    );
  };

  // Embed a single string
  async embed(text) {
    // const result = this.pipe && (await this.pipe(text));
    // return {
    //   id: uuidv4(),
    //   metadata: {
    //     text,
    //   },
    //   values: Array.from(result.data),
    //   // values: [],
    // };
  }

  // Batch an array of string and embed each batch
  // Call onDoneBatch with the embeddings of each batch
  async embedBatch(
    texts,
    batchSize,
    onDoneBatch
  ) {
    // const batches = embedder.sliceIntoChunks(texts, batchSize);
    // for (const batch of batches) {
    //   const embeddings = await Promise.all(
    //     batch.map((text) => this.embed(text.pageContent))
    //   );
    // }
  }
}

const embedder = new Embedder();

export { embedder };