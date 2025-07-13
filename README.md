# Chat with a Doc

`Chat with a Doc` is a lightweight Retrieval-Augmented Generation (RAG) service and UI that lets you **talk to the contents of any PDF, DOCX, TXT file, or public webpage**.  
Under the hood it stores MiniLM embeddings, retrieves the most relevant chunks, and asks a **large language model (LLM)** to answer your question.

👉 **Live demo** (Hugging Face Space): <https://huggingface.co/spaces/melbinjp/chat_with_a_doc>

---

## Features

* Upload a document (≤ 5 MB) *or* paste a URL
* Automatic text extraction (PyPDF2, python-docx, BeautifulSoup)
* Sentence-Transformers `all-MiniLM-L6-v2` for embeddings
* LLM endpoint (configurable) for answer generation
* FastAPI backend + vanilla JS frontend
* Space-ready: runs on port **7860** and uses the Hugging Face Docker SDK

---

## Quick Start (local)

```bash
# 1. Clone
git clone https://github.com/melbinjp/chat_with_a_doc.git
cd chat_with_a_doc

# 2. Install deps (Python 3.10+) and **set your Gemini key**
python -m venv .venv && source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
export LLM_API_KEY="YOUR_MODEL_KEY"  # still passed as GOOGLE_API_KEY at runtime

# 3. Run
uvicorn app:app --reload --port 7860
# browse http://localhost:7860
```

### With Docker

```bash
docker build -t chat-with-a-doc .
# pass your key at run-time
docker run -e GOOGLE_API_KEY=$GOOGLE_API_KEY -p 7860:7860 chat-with-a-doc
```

---

## Embedding in another site

If you just need an **iframe wrapper** (e.g. for `wecanuseai.com`) use the provided `embed.html`:

```html
<iframe src="https://melbinjp-chat-with-a-doc.hf.space" width="100%" height="600" frameborder="0" loading="lazy"></iframe>
```

The same file is published via GitHub Pages so you can link to:

```
https://melbinjp.github.io/chat_with_a_doc/embed.html
```

---

## License

This project is licensed under the [Apache 2.0](LICENSE) license.
