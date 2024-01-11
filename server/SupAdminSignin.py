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

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId

app = Flask(__name__)
CORS(app)
app.config["MONGO_URI"] = "mongodb://localhost:27017/chatbot"
mongo = PyMongo(app)

@app.route('/admins', methods=['GET', 'POST'])
def admins():
    if request.method == 'POST':
        data = request.json
        hashed_password = generate_password_hash(data['password'])
        new_admin = {
            'name': data['name'],
            'business_name': data['business_name'],
            'logo': data['logo'],
            'email': data['email'],
            'phone': data['phone'],
            'city': data['city'],
            'pincode': data['pincode'],
            'password': hashed_password,
            'enabled': True
        }
        mongo.db.admins.insert_one(new_admin)
        return jsonify({'message': 'Admin added successfully'}), 201

    elif request.method == 'GET':
        admins = mongo.db.admins.find()
        admins_list = []
        for admin in admins:
            admin['_id'] = str(admin['_id'])  # Convert ObjectId to str
            admins_list.append(admin)
        return jsonify({'admins': admins_list}), 200

@app.route('/admins/<admin_id>', methods=['GET', 'PUT', 'DELETE'])
def admin(admin_id):
    admin = mongo.db.admins.find_one({'_id': ObjectId(admin_id)})

    if not admin:
        return jsonify({'error': 'Admin not found'}), 404

    admin['_id'] = str(admin['_id'])  # Convert ObjectId to str

    if request.method == 'GET':
        return jsonify({'admin': admin}), 200

    elif request.method == 'PUT':
        data = request.json
        hashed_password = generate_password_hash(data['password'])
        updated_admin = {
            'name': data['name'],
            'business_name': data['business_name'],
            'logo': data['logo'],
            'email': data['email'],
            'phone': data['phone'],
            'city': data['city'],
            'pincode': data['pincode'],
            'password': hashed_password,
            # 'enabled': data['enabled']
        }
        mongo.db.admins.update_one({'_id': ObjectId(admin_id)}, {'$set': updated_admin})
        return jsonify({'message': 'Admin updated successfully'}), 200

    elif request.method == 'DELETE':
        mongo.db.admins.delete_one({'_id': ObjectId(admin_id)})
        return jsonify({'message': 'Admin deleted successfully'}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    admin = mongo.db.admins.find_one({'name': username})
    if admin and check_password_hash(admin['password'], password):
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

if __name__ == '__main__':
    app.run(debug=True)
