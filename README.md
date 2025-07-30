# 🎬 Netflix Movie Recommendation System

This is a content-based movie recommender system that uses TF-IDF vectorization and cosine similarity to suggest similar movies based on user input. It includes an interactive UI built with Streamlit.

---

## 📌 Features

- Input any movie title and get a list of similar movies
- Content-based filtering using overview, genre, and other metadata
- Simple Streamlit-based web interface
- Accuracy improved by ~30% using better text preprocessing
- Based on the movie metadata dataset

---

## 🧠 How It Works

1. **Text Vectorization**:
   - The movie descriptions are transformed into numerical vectors using **TF-IDF** (Term Frequency-Inverse Document Frequency).
2. **Similarity Calculation**:
   - Cosine similarity is calculated between the vectors to find similar movies.
3. **Recommendation Engine**:
   - Given a movie title, the system fetches the most similar movies based on their TF-IDF similarity.

---

## 🧰 Tech Stack

| Component   | Technology           |
|-------------|----------------------|
| Language    | Python               |
| ML Library  | Scikit-learn (TF-IDF, Cosine) |
| Web App     | Streamlit            |
| Data        | Movie Metadata (CSV) |
| Notebook    | Jupyter (.ipynb)     |

---

## 🚀 How to Run

```bash
# Step 1: Clone the repo
git clone https://github.com/<your-username>/netflix-recommender.git
cd netflix-recommender

# Step 2: Create virtual environment (optional)
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Step 3: Install dependencies
pip install -r requirements.txt

# Step 4: Run the Streamlit app
streamlit run app.py
```

---

## 📁 Project Structure

```
netflix_recommender/
├── app.py                             # Streamlit UI
├── utils.py                           # Functions for TF-IDF, similarity
├── requirements.txt                   # Dependencies
├── README.md
├── notebook/
│   └── Netflix_Movie_Recommendation_System.ipynb
```

---

## 📊 Example Output

> User inputs: **Inception**  
> Output: Shutter Island, Interstellar, The Prestige, etc.

---

## 👨‍💻 Author

**Shubham Ghalsasi**  
Final Year B.Tech – Cloud Computing  
MIT ADT University  
📫 ghalsasishubham@gmail.com

