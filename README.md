# **Book Recommendations with Weaviate & Ollama**

## **Overview**
This project demonstrates how to set up **Weaviate locally using Docker** and integrate **Ollama** for vector embeddings and inference. It utilizes **Node.js** to perform **semantic and generative (RAG) search** for book recommendations.

This project showcases how **Weaviate & Ollama** power **intelligent book recommendations** through **semantic search** and **generative AI (RAG)**.

---
<img width="1573" alt="image" src="https://github.com/user-attachments/assets/de312e84-414b-45dd-9bed-e660d43fb9c1" />

---

## **Environment Setup**
### **1. Start Weaviate with Docker**
Run Weaviate locally using Docker Compose:
```bash
docker-compose -f docker-compose.yml up -d
```
🔹 **Note:** The current `docker-compose.yml` includes **Ollama modules only**. If you need a different vectorizer, update the configuration:  
🔗 [Weaviate Docker Installation Guide](https://weaviate.io/developers/weaviate/installation/docker-compose)

### **2. Install Ollama and Pull Models**
Download Ollama for your OS: **[Ollama Official Site](https://ollama.com)**  
Then pull the required models:
```bash
ollama pull nomic-embed-text:latest  # For embeddings
ollama pull llama3.2:latest          # For inference
```

---

## **Project Setup**
Install dependencies:
```bash
npm i
```
Then execute each step to understand how **Weaviate & Ollama interact**.

---

## **Steps of Execution**
### **1. Create Collection**
```bash
node 1-createCollection.ts
```
🔹 Sets up a **"Book" collection** in Weaviate.  
🔹 Configures Ollama for **embedding** (`nomic-embed-text`) and **generative tasks** (`llama3.2`).

### **2. Populate Collection**
```bash
node 2-populateCollection.ts
```
🔹 Loads **book data** into Weaviate using a Kaggle dataset.

### **3. Semantic Search**
```bash
node 3-semanticSearch.ts
```
🔹 Performs **semantic search** to find books **similar to a query** using vector embeddings.

### **4. Generative Search (RAG)**
```bash
node 4-generativeSearch.ts
```
🔹 Retrieves relevant books via semantic search.  
🔹 Uses **LLM-powered generation** (`llama3.2`) to **synthesize responses**.

---

## **Semantic vs. Generative Search**
### **🔍 Semantic Search**
✅ Understands **meaning & context**, not just keywords.  
✅ Uses **vector embeddings** to find **conceptually similar books**.  
✅ Ideal for queries like:  
  - *"Find books similar to X"*.  
  - *"Search for books about lost identity"*.  

🔸 **Limitations:**  
  - Returns **existing data** (doesn’t generate new answers).  
  - Effectiveness depends on **embedding quality**.

### **🧠 Generative Search (RAG)**
✅ Retrieves **relevant documents** using semantic search.  
✅ Passes them to **LLM (Ollama's `llama3.2`)** to **generate a human-like response**.  
✅ Ideal for:
  - *Summarizing book content*  
  - *Answering questions about books*  
  - *Generating recommendations*  

🔸 **Limitations:**  
  - **Slower** due to the additional LLM generation step.  
  - **Context-dependent:** Poor document retrieval leads to **less accurate results** ("garbage in, garbage out").  
  - **Computationally intensive** compared to semantic search alone.

---

## **Choosing the Right Embedding Model**
### **✅ Why `nomic-embed-text`?**
- **Optimized for natural language** (book titles, summaries, reviews).
- Excels in **semantic similarity tasks**.

### **❌ Why Not `snowflake-arctic-embed`?**
- Tuned for **structured enterprise data** (logs, financial docs).
- Less effective in capturing **literary & thematic meaning**.
- Suitable only for **metadata-based queries** (e.g., *"Books by Stephen King after 2000"*).

---
<img width="1504" alt="image" src="https://github.com/user-attachments/assets/a6545717-1c40-4b4f-901f-8412d20d9d60" />

