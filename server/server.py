import os
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_jwt_extended import create_access_token, JWTManager
from pymongo import MongoClient
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity


app = Flask(__name__)
CORS(app)
# app.config["MONGO_UR"] = os.getenv("MONGO_URI")
app.config['JWT_SECRET_KEY'] = '1F76961362D832146966AEEFE7C8CEB06BE3A9BEFD40B2707FBCEC32E436BB44'
# mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Replace the connection string with your MongoDB Atlas connection string
atlas_connection_string = os.getenv("MONGO_URI")
client = MongoClient(atlas_connection_string)
db = client['chatbot']
# collection = db['superadmin']
app.config['JWT_SECRET_KEY'] = '1F76961362D832146966AEEFE7C8CEB06BE3A9BEFD40B2707FBCEC32E436BB44'


information = db.superadmin
admin_info = db.admin
profile_info = db.profile_info

# Check if data exists before inserting
# if information.count_documents({}) == 0:
#     users = [
#         {'username': 'superadmin', 'password': 'superadminpassword', 'role': 'superadmin'},
#         # {'username': 'admin1', 'password': 'admin1password', 'role': 'admin'},
#     ]
#     information.insert_many(users)


@app.route('/superadmin/signup', methods=['POST'])
def super_admin_signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    existing_admin = information.find_one({'username': username})
    if existing_admin:
        return jsonify({'error': 'Username of superadmin already exists'}), 400

    hashed_password = generate_password_hash(password)
    new_superadmin = {
        'username': username,
        'password': hashed_password,
        'role': 'superadmin'
    }
    information.insert_one(new_superadmin)
    return jsonify({'message': 'superAdmin created successfully'}), 201


@app.route('/superadmin/login', methods=['POST'])
def super_admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    superadmin = db.superadmin.find_one({'username': username})
    if superadmin and check_password_hash(superadmin['password'], password):
        user_id = str(superadmin['_id'])
        access_token = create_access_token(identity=user_id)
        return jsonify(access_token=access_token), 200
        return jsonify({'success': True, 'message': 'Login successful by server'})
    else:
        return jsonify({'error': 'Invalid credentialsdsds','success':False ,' message':'login un successfull by server'}), 401
        # return jsonify({'success': False, 'message': 'Login failed by server'})
    # super_admin = db.superadmin.find_one({'username': username})
    # if super_admin and check_password_hash(super_admin['password'], password):
    #     access_token = create_access_token(identity=str(super_admin['_id']))
    #     return jsonify(access_token=access_token), 200
    # else:
    #     return jsonify({'error': 'Invalid credentials'}), 401
    # if username == 'superadmin' and password == 'superadminpassword':
        
    # else:
    #     return jsonify({'success': False, 'message': 'Login failed by server'})


<<<<<<< HEAD
@app.route('/')
def index():
    # for _ in admin.find():
    #     return json.dumps(i, indent=4, default=json_util.default)
    return render_template('index.html')
=======
# @app.route('/')
# def index():
#     return render_template('index.html')

>>>>>>> 701f58cbf7eb89edd4f97e298523070e793ce799


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


def insert_user_data(data):
    data["timestamp"] = datetime.now()
    profile_info.insert_one(data)
@app.route('/admin/register', methods=['POST'])
def register():
    data = request.get_json()
    insert_user_data(data)
    return jsonify({'message': 'User registered successfully!'})



# @app.route('/admin/profile', methods=['POST'])
# def update_user_stats(Name,Business_Name,Email,Phone,City,PinCode,Password,Confirm_Password,):
#     # Create a document to insert into the collection
#     data = request.get_json()
#     stats = data.get('stats')
#     stats = {
#         "timestamp": datetime.now(),
#         "Name": Name,
#         "Business_Name": Business_Name,
#         "Email_id": Email,
#         "Phone_Number": Phone,
#         "City ": City,
#         "PinCode ": PinCode,
#         "Password ": Password,
#         "Confirm_Password ": Confirm_Password,
#     }
#     # Insert the document into the collection
#     profile_info.insert_one(stats)
#     print("User statistics updated.")

# def main():
#     # Example usage to update user statistics
#     Name = input("Enter your Name : ")
#     Business_Name = input("Enter Your Business name : ")
#     Email = input("Enter your Email is : ")
#     Phone = int(input("Enter your phone number : "))
#     City = input("Enter your City : ")
#     PinCode = int(input("Enter your PinCode : "))
#     Password = input("Enter your Password : ")
#     Confirm_Password = input("Enter your confirm Password :")

#     update_user_stats(Name,Business_Name,Email,Phone,City,PinCode,Password,Confirm_Password)


if __name__ == '__main__':
    app.run(debug=True)
