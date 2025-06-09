from flask import Flask, render_template, request
import json, random
import os

app = Flask(__name__)

with open('questions.json', encoding='utf-8') as f:
    ALL_QUESTIONS = json.load(f)

@app.route('/')
def menu():
    return render_template('index.html')

@app.route('/quiz')
def quiz():
    mode = request.args.get('mode', 'full')
    if mode == 'timed':
        minutes = int(request.args.get('minutes', 25))
        questions = random.choices(ALL_QUESTIONS, k=25)
        total = 25
        timed = True
    else:
        minutes = None
        questions = random.sample(ALL_QUESTIONS, k=len(ALL_QUESTIONS))
        total = len(ALL_QUESTIONS)
        timed = False
    return render_template('quiz.html',
                           questions=questions,
                           total=total,
                           timed=timed,
                           minutes=minutes)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)

