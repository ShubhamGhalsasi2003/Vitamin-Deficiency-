#  Vitamin Deficiency Detection System

This is a project I built to detect common vitamin deficiencies (A, B, C, D, E) from an image uploaded by the user.  
The goal is to make a simple tool where someone can upload a photo, and the system will predict which vitamin might be lacking based on trained models.

---

## 📌 Features

- Simple image upload page for prediction
- FastAPI backend with ML model integration
- Two models used:
  - PyTorch CNN (`vitamin_classifier.pth`)
  - Scikit-learn fallback model (`vitamin_model.pkl`)
- Confidence score with each prediction
- Basic user authentication (login/register) using SQLite
- Responsive UI using Bootstrap (Jinja2 templates)

---

## 🧰 Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | HTML + CSS (Bootstrap + Jinja2)|
| Backend      | Python (FastAPI)               |
| ML Inference | PyTorch and Scikit-learn       |
| Database     | SQLite (`users.db`)            |
| Server       | Uvicorn, Pillow                |

---

## 🗂 Project Structure

```
minimini/
├── app.py                     # FastAPI app
├── backend/                   # DB + auth functions
├── Model/
│   ├── vitamin_classifier.pth
│   ├── vitamin_model.pkl
│   └── label_map.pkl
├── dataset/                   # Image dataset (A, B, C, D, E)
├── templates/                 # HTML templates
│   ├── Home.html
│   ├── upload.html
│   ├── result.html
│   └── auth/*.html
├── statics/                   # CSS, JS, sample images
├── requirements.txt           # Python packages
├── train_pytorch_model.py     # CNN model training script
├── train_sklearn_model.py     # Scikit-learn training script
```

---

## 🚀 How to Run the Project (Locally)

```bash
# Step 1: Clone the repository
git clone https://github.com/<your-username>/vitamin-deficiency-detector.git
cd vitamin-deficiency-detector/minimini

# Step 2: (Optional) Set up a virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scriptsctivate

# Step 3: Install all dependencies
pip install -r requirements.txt

# Step 4: Start the FastAPI server
uvicorn app:app --reload
```

Visit `http://127.0.0.1:8000` in your browser.

---

## 🧠 Workflow Steps (Internally Performed)

Here’s what happens inside the app when a user uploads an image:

1. **User uploads a photo** using the upload page.
2. **FastAPI backend receives the image** and temporarily stores it.
3. **Pillow** processes the image (resize, grayscale/RGB, normalize).
4. The trained **PyTorch model** is loaded and used to predict the class.
   - If PyTorch model is not available, it falls back to Scikit-learn.
5. The **model outputs the vitamin class** (A/B/C/D/E) and confidence score.
6. The result is returned as JSON and displayed on the result page.
7. (Optional) If login system is enabled, results can be tied to the user.

---

## 🧪 Training the Model

### ▶️ To train the PyTorch CNN model:
```bash
python train_pytorch_model.py --epochs 20 --data_dir dataset
```

### ▶️ To train the Scikit-learn model:
```bash
python train_sklearn_model.py
```

Both trained files are stored inside `/Model/`.

---

## 👨‍💻 Author

**Shubham Ghalsasi**  
Final Year B.Tech – Cloud Computing  
MIT ADT University, Pune  
📧 Email: ghalsasishubham@gmail.com


