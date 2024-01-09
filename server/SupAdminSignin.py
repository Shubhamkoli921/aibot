from flask import Flask, request, jsonify
from datetime import datetime
import pymongo
app = Flask(__name__)
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["your_database_name"]  # Replace 'your_database_name' with your database name
collection = db["user_stats"]  # Collection to store user statistics
def insert_user_data(data):
    data["timestamp"] = datetime.now()
    collection.insert_one(data)
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    insert_user_data(data)
    return jsonify({'message': 'User registered successfully!'})
if __name__ == '__main__':
    app.run(debug=True)