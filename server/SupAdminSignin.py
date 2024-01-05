from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_pymongo import PyMongo
from pymongo import MongoClient

app = Flask(__name__)


@app.route('/')
def index():
    return jsonify({'message': 'Flask and MongoDB are connected!'})


app.config["MONGO_URI"] = "mongodb://localhost:27017/chatbot"
app.config['JWT_SECRET_KEY'] = '1F76961362D832146966AEEFE7C8CEB06BE3A9BEFD40B2707FBCEC32E436BB44'

mongo = PyMongo(app)
jwt = JWTManager(app)
CORS(app, resources={"/superadmin/*": {"origins": "*"}})  # Apply CORS only to /superadmin routes

client = MongoClient('mongodb://127.0.0.1:27017/')
db = client['chatbot']

information = db.superadmin

# Check if data exists before inserting
if information.count_documents({}) == 0:
    users = [
        {'username': 'superadmin', 'password': 'superadminpassword', 'role': 'superadmin'},
        {'username': 'admin1', 'password': 'admin1password', 'role': 'admin'},
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


@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    super_admin = mongo.db.superadmin.find_one({'username': current_user_id})
    if super_admin:
        return jsonify(logged_in_as='super admin'), 200
    else:
        return jsonify({'error': 'Invalid token'}), 401


if __name__ == '__main__':
    app.run(debug=True)
