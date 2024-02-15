import os
import secrets
import calendar
from flask import Flask, jsonify, request, render_template, session , g ,url_for
from flask_cors import CORS
from flask_jwt_extended import create_access_token, JWTManager
from pymongo import MongoClient
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from flask_pymongo import PyMongo
from bson import ObjectId
from bson import json_util
from collections import defaultdict
import logging

from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import pandas as pd
from pymongo.errors import DuplicateKeyError 
from io import StringIO
import datetime as dt
from collections import Counter
from functools import wraps

import openai       
# import re

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
# users_collection = db.users
historyofchats = db.chathistory
demochats = db.democ




def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            data = jwt.decode(token, app.config['1F76961362D832146966AEEFE7C8CEB06BE3A9BEFD40B2707FBCEC32E436BB44'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(*args, **kwargs)
    return decorated




@app.route('/chat', methods=['GET', 'POST'])
@jwt_required()
def chat():
    if request.method == 'GET':
        try:
            # Provide initial instructions or data for initializing the chat session
            initial_message = "Hello! I'm Chatbot.ai. Please provide your name to start the conversation."
            return jsonify({'message': initial_message})

        except Exception as e:
            print('Error:', e)
            response_data = {'message': 'An error occurred. Please try again later.'}
            return jsonify(response_data), 500
    elif request.method == 'POST':
        try:
            # Handle the POST request for sending and receiving messages
            current_user = get_jwt_identity()
            user_query = request.json.get('message', '').lower()
            user_id = request.json.get('userId', '')
            user_name = request.json.get('userName', '')
            admin_id = current_user  # Assigning current_user directly to admin_id

            chat_history_user = {
                "user_id": user_id,
                "user_name": user_name,
                "admin_id": admin_id,
                "role": "user",
                "message": user_query,
                "timestamp": get_current_timestamp()
            }
            demochats.insert_one(chat_history_user)

            response = openai.Completion.create(
                engine="gpt-3.5-turbo-instruct",
                prompt=f"User: {user_query}\nChatbot:",
                temperature=0.7,
                max_tokens=150,
                )
            bot_response = response['choices'][0]['text']

            chat_history_bot = {
                "user_id": user_id,
                "user_name": user_name,
                "admin_id": admin_id,
                "role": "bot",
                "message": bot_response,
                "timestamp": get_current_timestamp()
            }
            demochats.insert_one(chat_history_bot)

            response_data = {
                'message': bot_response,
                'admin_id': admin_id
            }
            return jsonify(response_data), 200

        except Exception as e:
            print('Error:', e)
            response_data = {'message': 'An error occurred. Please try again later.'}
            return jsonify(response_data), 500

@app.before_request
def set_admin_id():
    g.admin_id = None
    if hasattr(g, 'jwt_claims') and 'username' in g.jwt_claims:
        g.admin_id = g.jwt_claims['username']

def get_current_timestamp():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')




@app.route('/chat/history', methods=['GET'])
@jwt_required()
def get_chat_history():
    try:
        current_admin_id = get_jwt_identity()
        admin_chat_history = list(demochats.find({"admin_id": current_admin_id}))

        # Calculate total user messages, bot messages, and total number of chats
        total_user_messages = sum(1 for chat in admin_chat_history if chat['role'] == 'user')
        total_bot_messages = sum(1 for chat in admin_chat_history if chat['role'] == 'bot')
        total_no_chats = total_user_messages + total_bot_messages

        # Count the number of user and bot messages
        user_message_counts = Counter(chat['user_id'] for chat in admin_chat_history if chat['role'] == 'user')
        bot_message_counts = Counter(chat['user_id'] for chat in admin_chat_history if chat['role'] == 'bot')

        # Extract day of the week from timestamp and count total chats for each day
        daywise_chat_counts = {calendar.day_name[day]: 0 for day in range(7)}  # Use day names instead of numbers
        for chat in admin_chat_history:
            timestamp = datetime.strptime(chat['timestamp'], '%Y-%m-%d %H:%M:%S')
            day_of_week = timestamp.weekday()
            day_name = calendar.day_name[day_of_week]
            daywise_chat_counts[day_name] += 1

        # Extract month from timestamp and count total chats for each month
        monthwise_chat_counts = {calendar.month_name[month]: 0 for month in range(1, 13)}  # Use month names instead of numbers
        for chat in admin_chat_history:
            timestamp = datetime.strptime(chat['timestamp'], '%Y-%m-%d %H:%M:%S')
            month_name = calendar.month_name[timestamp.month]
            monthwise_chat_counts[month_name] += 1

        # Group chat history by user name
        user_chat_history_grouped = defaultdict(list)
        for chat in admin_chat_history:
            user_chat_history_grouped[chat['user_name']].append(chat)

        # Create the desired format for chat history
        formatted_chat_history = []
        for user_name, chat_history in user_chat_history_grouped.items():
            formatted_chat_data = [
                {
                    "_id": str(chat['_id']),
                    "role": chat['role'],
                    "message": chat['message'],
                    "timestamp": chat['timestamp']
                }
                for chat in chat_history
            ]
            formatted_chat_history.append({
                "user_name": user_name,
                "user_id": chat_history[0]['user_id'],  # Assuming user_id is the same for all messages of a user
                "data": formatted_chat_data
            })

        # Create the response data
        response_data = {
            "adminId": current_admin_id,
            "total_user_messages": total_user_messages,
            "total_bot_messages": total_bot_messages,
            "total_no_chats": total_no_chats,
            "user_message_counts": dict(user_message_counts),
            "bot_message_counts": dict(bot_message_counts),
            "daywise_chat_counts": daywise_chat_counts,
            "monthwise_chat_counts": monthwise_chat_counts,
            "chat_history": formatted_chat_history
        }

        # Serialize the response data to JSON using json_util
        json_response = json_util.dumps(response_data)

        return json_response, 200, {'Content-Type': 'application/json'}

    except Exception as e:
        print('Error:', e)
        response_data = {'message': 'An error occurred. Please try again later.'}
        return jsonify(response_data), 500






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
        admin_id = str(superadmin['_id'])
        access_token = create_access_token(identity=admin_id)
        return jsonify(access_token=access_token, adminId=admin_id), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

       



logging.basicConfig(level=logging.DEBUG)

@app.route('/admins', methods=['POST','GET'])
@jwt_required()
def admins():
    try:
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
            admin_id = adminusersinfo.insert_one(new_admin).inserted_id

            # Create chatbot link based on admin_id
            chatbot_link = f"http://localhost:3000/chat/{admin_id}"

            # Update the admin document to include the chatbot link
            adminusersinfo.update_one(
                {'_id': admin_id},
                {'$set': {'chatbot_link': chatbot_link}}
            )

            return jsonify({
                'message': 'Admin added successfully',
                'admin_id': str(admin_id),
                'chatbot_link': chatbot_link
            }), 201

        elif request.method == 'GET':
            admins = list(adminusersinfo.find())
            admins_list = []
            for admin in admins:
                admin['_id'] = str(admin['_id'])  # Convert ObjectId to str
                admins_list.append(admin)

            current_admin_id = get_jwt_identity()
            return jsonify({'admins': admins_list, 'current_admin_id': current_admin_id}), 200
    except Exception as e:
        logging.error(f"Exception occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500



@app.route('/admins/<admin_id>', methods=['GET', 'PUT', 'DELETE'])
def admin(admin_id):
    try:
        admin = adminusersinfo.find_one({'_id': ObjectId(admin_id)})
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404

        if request.method == 'GET':
            admin_dict = {
                'name': admin['name'],
                'business_name': admin['business_name'],
                'logo': admin['logo'],
                'email': admin['email'],
                'phone': admin['phone'],
                'city': admin['city'],
                'pincode': admin['pincode'],
                'password': admin['password'],
                'enabled': admin['enabled']
            }
            return jsonify({'admin': admin_dict}), 200

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
            }
            adminusersinfo.update_one({'_id': ObjectId(admin_id)}, {'$set': updated_admin})
            return jsonify({'message': 'Admin updated successfully'}), 200

        elif request.method == 'DELETE':
            adminusersinfo.delete_one({'_id': ObjectId(admin_id)})
            return jsonify({'message': 'Admin deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('name')
    password = data.get('password')

    # Query the database to find the user
    user = adminusersinfo.find_one({'name': username})

    if user and check_password_hash(user['password'], password):
        # If user is found and password matches, create an access token
        access_token = create_access_token(identity=str(user['_id']))
        # Return the access token and adminId as JSON response
        return jsonify(access_token=access_token, adminId=str(user['_id'])), 200
    else:
        # If user is not found or credentials are incorrect, return error response
        return jsonify({'error': 'Invalid credentials'}), 401

# Protected route example
# Protected route example
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200



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




if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
    print(f"The Flask app is running on port: {app.url_map.port}")