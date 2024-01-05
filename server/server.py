from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

# Replace the connection string with your MongoDB Atlas connection string
atlas_connection_string = os.getenv("MONGO_URI")
client = MongoClient(atlas_connection_string)
db = client['chatbot']
# collection = db['superadmin']


information = db.superadmin
# admins_collection = db.admins

# Check if data exists before inserting
if information.count_documents({}) == 0:
    users = [
        {'username': 'superadmin', 'password': 'superadminpassword', 'role': 'superadmin'},
        # {'username': 'admin1', 'password': 'admin1password', 'role': 'admin'},
    ]
    information.insert_many(users)


@app.route('/superadmin/login', methods=['POST'])
def super_admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # super_admin = mongo.db.superadmin.find_one({'username': username})
    # if super_admin and check_password_hash(super_admin['password'], password):
    #     access_token = create_access_token(identity=str(super_admin['_id']))
    #     return jsonify(access_token=access_token), 200
    # else:
    #     return jsonify({'error': 'Invalid credentials'}), 401
    if username == 'superadmin' and password == 'superadminpassword':
        return jsonify({'success': True, 'message': 'Login successful by server'})
    else:
        return jsonify({'success': False, 'message': 'Login failed by server'})


if __name__ == '__main__':
    app.run(debug=True)