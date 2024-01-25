from flask import Flask, render_template, request, jsonify
import pandas as pd
from io import StringIO

app = Flask(__name__)

# Enable CORS for all routes
from flask_cors import CORS
CORS(app)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']

        # check if the file is empty
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # check if the file is allowed
        allowed_extensions = {'csv'}
        if '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in allowed_extensions:
            # Read CSV data into Pandas DataFrame, skipping the first row
            df = pd.read_csv(file, skiprows=[0])

            # Process the DataFrame (you can add your logic here)
            # For example, get the first 5 rows as JSON
            result = df.head().to_json(orient='records')

            return jsonify({'result': result})

        else:
            return jsonify({'error': 'Invalid file type. Please upload a CSV file'}), 400

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
