import os
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_jwt_extended import create_access_token, JWTManager
from pymongo import MongoClient
from werkzeug.security import check_password_hash, generate_password_hash
from bson import json_util
import json

app = Flask(__name__)
CORS(app)
jwt = JWTManager(app)

# Replace the connection string with your MongoDB Atlas connection string
atlas_connection_string = os.getenv("MONGO_URI")
client = MongoClient(atlas_connection_string)
db = client['chatbot']
# collection = db['superadmin']
app.config['JWT_SECRET_KEY'] = '1F76961362D832146966AEEFE7C8CEB06BE3A9BEFD40B2707FBCEC32E436BB44'


information = db.superadmin
admin_info = db.admin

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


@app.route('/')
def index():
    # for _ in admin.find():
    #     return json.dumps(i, indent=4, default=json_util.default)
    return render_template('index.html')


@app.route('/admin/signup', methods=['POST'])
def admin_signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    existing_admin = admin_info.find_one({'username': username})
    if existing_admin:
        return jsonify({'error': 'Username already exists'}), 400

    hashed_password = generate_password_hash(password)
    new_admin = {
        'username': username,
        'password': hashed_password,
        'role': 'admin'
    }
    admin_info.insert_one(new_admin)
    return jsonify({'message': 'Admin created successfully'}), 201


@app.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    admin = admin_info.find_one({'username': username})
    if admin and check_password_hash(admin['password'], password):
        user_id = str(admin['_id'])
        access_token = create_access_token(identity=user_id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401


if __name__ == '__main__':
    app.run(debug=True)
