import os
import secrets
from flask import Flask, jsonify, request, render_template, session
from flask_cors import CORS
from flask_jwt_extended import create_access_token, JWTManager
from pymongo import MongoClient
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from flask_pymongo import PyMongo
from bson import ObjectId
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import pandas as pd
from io import StringIO
import openai       


app = Flask(__name__)
CORS(app)
# app.config["MONGO_UR"] = os.getenv("MONGO_URI")
app.config['JWT_SECRET_KEY'] = '1F76961362D832146966AEEFE7C8CEB06BE3A9BEFD40B2707FBCEC32E436BB44'
# mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
app.secret_key = 't4Wm8Y0ypwYLzcwhDmEqJg'   

openai.api_key = "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"

# Sample CSV data (replace this with the actual CSV data from MongoDB)
csv_data = """
ProductName, Price, Description
python, 1000, Powerful laptop with high-speed processor
Smartphone, 500, Feature-rich smartphone with a great camera
Headphones, 100, Noise-canceling headphones for immersive audio
"""

# Load the CSV data into a Pandas DataFrame
csv_df = pd.read_csv(StringIO(csv_data))


# Replace the connection string with your MongoDB Atlas connection string
atlas_connection_string = os.getenv("MONGO_URI")
client = MongoClient(atlas_connection_string)
db = client['chatbot']
# collection = db['superadmin']
app.config['JWT_SECRET_KEY'] = '1F76961362D832146966AEEFE7C8CEB06BE3A9BEFD40B2707FBCEC32E436BB44'


information = db.superadmin
admin_info = db.admin
profile_info = db.profile_info
adminusersinfo = db.users
productdetail = db.bproducts

# Check if data exists before inserting
# if information.count_documents({}) == 0:
#     users = [
#         {'username': 'superadmin', 'password': 'superadminpassword', 'role': 'superadmin'},
#         # {'username': 'admin1', 'password': 'admin1password', 'role': 'admin'},
#     ]
#     information.insert_many(users)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data['user_message']

    # Make a request to the OpenAI API
    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",  # You can experiment with different engines
        prompt=user_message,
        max_tokens=150  # You can adjust the maximum number of tokens in the response
    )

    chat_response = response['choices'][0]['text'].strip()
    
    return jsonify({'chat_response': chat_response})


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


# @app.route('/')
# def index():
#     return render_template('index.html')





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



@app.route('/admins', methods=['GET', 'POST'])
def admins():
    if request.method == 'POST':
        data = request.json
        
        existing_admin = adminusersinfo.find_one({'name': data['name']})
        if existing_admin:
            return jsonify({'error': 'Username already exists'}), 400

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
        adminusersinfo.insert_one(new_admin)
        return jsonify({'message': 'Admin added successfully'}), 201

    elif request.method == 'GET':
        admins = adminusersinfo.find()
        admins_list = []
        for admin in admins:
            admin['_id'] = str(admin['_id'])  # Convert ObjectId to str
            admins_list.append(admin)
        return jsonify({'admins': admins_list}), 200

@app.route('/admins/<admin_id>', methods=['GET', 'PUT', 'DELETE'])
def admin(admin_id):
    admin = adminusersinfo.find_one({'_id': ObjectId(admin_id)})

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
        adminusersinfo.update_one({'_id': ObjectId(admin_id)}, {'$set': updated_admin})
        return jsonify({'message': 'Admin updated successfully'}), 200

    elif request.method == 'DELETE':
        adminusersinfo.delete_one({'_id': ObjectId(admin_id)})
        return jsonify({'message': 'Admin deleted successfully'}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    admin = adminusersinfo.find_one({'name': username})
    if admin and check_password_hash(admin['password'], password):
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401



def get_next_product_id():
    max_id = productdetail.find_one(sort=[("id", -1)])
    return max_id['id'] + 1 if max_id else 1

@app.route('/products', methods=['GET'])
def get_products():
    products = list(productdetail.find({}, {'_id': 0}))
    return jsonify(products)

@app.route('/products', methods=['POST'])
def add_product():
    new_product = request.json
    new_product['id'] = get_next_product_id()
    
    # Check for duplicate product name
    if productdetail.find_one({'productName': new_product['productName']}):
        return jsonify({"error": "Product with the same name already exists"}), 400

    productdetail.insert_one(new_product)
    return jsonify({"message": "Product added successfully"}), 201

@app.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    updated_product = request.json

    # Check if the product with the given ID exists
    existing_product = productdetail.find_one({"id": product_id})
    if not existing_product:
        return jsonify({"error": "Product not found"}), 404

    # Check for duplicate product name
    if (existing_product['productName'] != updated_product['productName'] and
            productdetail.find_one({'productName': updated_product['productName']})):
        return jsonify({"error": "Product with the same name already exists"}), 400

    productdetail.update_one({"id": product_id}, {"$set": updated_product})
    return jsonify({"message": "Product updated successfully"})

@app.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    # Check if the product with the given ID exists
    existing_product = productdetail.find_one({"id": product_id})
    if not existing_product:
        return jsonify({"error": "Product not found"}), 404

    productdetail.delete_one({"id": product_id})
    return jsonify({"message": "Product deleted successfully"})


@app.route("/products/bulk", methods=["POST"])
def add_bulk_products():
    new_products = request.json
    productdetail.insert_many(new_products)
    return jsonify({"message": "Bulk products added successfully"}), 201

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
