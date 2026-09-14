# Retrieval-Augmented Generation (RAG)

## What RAG is
RAG combines a retriever with a language model. Instead of asking an LLM to answer from memory
(which can hallucinate), you first retrieve relevant text from your own documents, then give
that text to the model as context so the answer is grounded and can cite its source.

## Chunking
Documents are split into smaller pieces called chunks before embedding. Chunking matters because
a whole document is too large to retrieve precisely; smaller chunks let the system return the exact
relevant passage for a question. Good chunking keeps related ideas together and avoids cutting
sentences in the middle.

## Embeddings
An embedding turns a piece of text into a vector — a list of numbers that captures its meaning.
Texts with similar meaning get similar vectors. This lets a computer compare meaning mathematically,
using distance or cosine similarity, rather than matching exact words.

## Vector search
To find relevant chunks for a question, you embed the question and compare its vector against the
stored chunk vectors, returning the closest ones (top-k). Cosine similarity is a common measure —
it compares the angle between two vectors, so it focuses on direction (meaning) not magnitude.

## Grounding and hallucination
Grounding means the model answers using the retrieved chunks, not its own guesses. This reduces
hallucination — confidently stated but false answers. A grounded system can also cite which
document a fact came from, which builds user trust.
