import os
import secrets
import calendar
from flask import Flask, jsonify, request, render_template, session , g ,url_for
from flask_cors import CORS
from flask_jwt_extended import create_access_token, JWTManager
from pymongo import MongoClient
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime, timedelta
from flask_pymongo import PyMongo
from bson import ObjectId
from bson import json_util
from collections import defaultdict
# from collections import defaultdict
import logging
import json
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import pandas as pd
from pymongo.errors import DuplicateKeyError 
from io import StringIO
import datetime as dt
from collections import Counter
from functools import wraps

import openai       
import re

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
products = [
    {"id": 1, "productName": "Laptop", "price": 1000, "description": "High-performance laptop"},
    {"id": 2, "productName": "Smartphone", "price": 500, "description": "Latest smartphone model"},
    {"id": 3, "productName": "Tablet", "price": 300, "description": "Portable tablet device"}
]

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


@app.before_request
def before_request():
    g.admin_id = request.args.get('admin_id', '') 


# @app.route('/chat', methods=['POST'])
# def chat():
#     if request.method == 'POST':
#         try:
#             user_query = request.json.get('message', '').lower()
#             user_id = request.json.get('userId', '')
#             user_name = request.json.get('userName', '')
#             admin_id = g.admin_id

#             # Insert user's message into the database
#             chat_history_user = {
#                 "user_id": user_id,
#                 "user_name": user_name,
#                 "admin_id": admin_id,
#                 "role": "user",
#                 "message": user_query,
#                 "timestamp": get_current_timestamp()
#             }
#             demochats.insert_one(chat_history_user)

#             # Generate bot's response
#             bot_response = generate_bot_response(user_query, user_id, user_name, admin_id)

#             # Format bot's response including user's message
#             bot_response_with_user_message = f"\n{bot_response}"

#             # Insert bot's response into the database
#             chat_history_bot = {
#                 "user_id": user_id,
#                 "user_name": user_name,
#                 "admin_id": admin_id,
#                 "role": "bot",
#                 "message": bot_response_with_user_message,
#                 "timestamp": get_current_timestamp()
#             }
#             demochats.insert_one(chat_history_bot)

#             # Return the formatted bot response
#             return bot_response, 200
#         except Exception as e:
#             print('Error:', e)
#             response_data = {'message': 'An error occurred. Please try again later.'}
#             return jsonify(response_data), 500


# def generate_bot_response(user_query, user_id, user_name, admin_id):
#     if 'product details' in user_query:
#         return get_product_details_response()
#     elif 'below' in user_query and any(char.isdigit() for char in user_query):
#         return get_products_below_price_response(user_query)
#     elif 'above' in user_query and any(char.isdigit() for char in user_query):
#         return get_products_above_price_response(user_query)
#     elif 'description' in user_query:
#         return get_product_description_response(user_query)
#     elif 'range' in user_query and any(char.isdigit() for char in user_query):
#         min_price, max_price = extract_price_range(user_query)
#         return get_products_in_price_range_response(min_price, max_price)
#     elif 'specific price' in user_query:
#         return get_products_by_specific_price_response(user_query)
#     elif 'price is' in user_query and any(char.isdigit() for char in user_query):
#         price = extract_specific_price(user_query)
#         return get_products_by_specific_price_response(price)
#     else:
#         return get_products_by_name_response(user_query)


# def format_product_details(products):
#     if products:
#         formatted_results = []
#         for i, product in enumerate(products, start=1):
#             formatted_product = f"{i}. Product Name: {product['productName']}, Price: {product['price']}, Description: {product['description']}"
#             formatted_results.append(formatted_product)
#         return "\n".join(formatted_results)
#     else:
#         return "No products found."


# def get_product_details_response():
#     search_results = get_all_products()
#     return format_product_details(search_results)

# def find_product_by_name(product_name):
#     # Implement logic to search for the product in the database
#     # This could involve querying your database or accessing your product data in some way
#     # Return the product if found, otherwise return None
#     # Example:
#     product = productdetail.find_one({"productName": product_name})
#     return product

# def get_product_description_response(user_query):
#     product_name = extract_product_name(user_query)
#     if product_name:
#         product = find_product_by_name(product_name)
#         if product:
#             return product['description']
#         else:
#             return "Product not found."
#     else:
#         return "Please specify the product name."

# def extract_specific_price(user_query):
#     try:
#         # Use regular expression to extract the price from the user query
#         price_match = re.search(r'\b\d+\b', user_query)
#         if price_match:
#             price = float(price_match.group())
#             return price
#         else:
#             return None
#     except ValueError:
#         return None

# def get_products_by_specific_price_response(price):
#     # Query the database to find products with the specified price
#     matching_products = search_products_by_specific_price(price)
    
#     if matching_products:
#         return format_product_details(matching_products)
#     else:
#         return "No products found at the specified price."


# def search_products_by_specific_price(price):
#     # Assume you're using MongoDB and your collection is named 'products'
#     query = {"price": price}
#     matching_products = productdetail.find(query)
#     return list(matching_products)


# def extract_product_name(user_query):
#     # Define patterns to match product names
#     patterns = [
#         r'(?:describe|description of)\s+(?P<product_name>.+)',
#         r'(?:details|detail of)\s+(?P<product_name>.+)'
#     ]

#     # Loop through patterns to find a match
#     for pattern in patterns:
#         match = re.search(pattern, user_query)
#         if match:
#             # Extract the product name from the matched group   
#             product_name = match.group('product_name').strip()
#             return product_name

#     # If no match is found, return None
#     return None

# def search_products_above_price(min_price):
#     query = {'price': {'$gt': min_price}}
#     return list(productdetail.find(query))

# def get_products_below_price_response(user_query):
#     max_price = extract_price(user_query)
#     if max_price:
#         search_results = search_products_below_price(max_price)
#         if search_results:
#             return format_product_details(search_results)
#         else:
#             return "No products found below the specified price."
#     else:
#         return "Please specify a valid price to search for products below."


# def get_products_above_price_response(user_query):
#     min_price = extract_price(user_query)
#     if min_price:
#         search_results = search_products_above_price(min_price)
#         if search_results:
#             return format_product_details(search_results)
#         else:
#             return "No products found above the specified price."
#     else:
#         return "Please specify a valid price to search for products above."

# def get_products_by_name_response(user_query):
#     search_results = search_products_by_name(user_query)
#     if search_results:
#         return format_product_details(search_results)
#     else:
#         return "No products found matching your search criteria."

# def get_products_in_price_range_response(min_price, max_price):
#     # Perform a query to retrieve products within the specified price range
#     # Assuming productdetail is a database collection or an appropriate data structure
#     query = {
#         'price': {'$gte': min_price, '$lte': max_price}
#     }
#     matching_products = productdetail.find(query)
#     products_list = list(matching_products)
#     return format_product_details(products_list)

# def extract_price_range(query):
#     try:
#         # Split the query to extract the price range
#         parts = query.split('range between')
#         if len(parts) != 2:
#             return None, None
        
#         # Extract and strip the minimum and maximum prices
#         min_price, max_price = parts[1].strip().split('to')
        
#         # Convert prices to float
#         min_price = float(min_price.strip())
#         max_price = float(max_price.strip())
        
#         return min_price, max_price
#     except ValueError:
#         return None, None


# def get_specific_product_price_response(user_query):
#     product_name = extract_product_name(user_query)
#     if product_name:
#         product = find_product_by_name(product_name)
#         if product:
#             return f"The price of {product_name} is {product['price']}"
#         else:
#             return "Product not found."
#     else:
#         return "Please specify the product name."

# def extract_price(query):
#     try:
#         if 'below' in query:
#             price_str = query.split('below')[-1].strip()
#         elif 'above' in query:
#             price_str = query.split('above')[-1].strip()
#         else:
#             return None
#         return float(price_str)
#     except ValueError:
#         return None


# def format_product_details(products):
#     if products:
#         formatted_results = []
#         for product in products:
#             formatted_product = {
#                 'productName': product['productName'],
#                 'price': product['price'],
#                 'description': product['description']
#             }
#             formatted_results.append(formatted_product)
#         return formatted_results
#     else:
#         return "No products found."

# def search_products_by_name(product_name):
#     query = {"productName": {"$regex": product_name, "$options": "i"}}
#     return list(productdetail.find(query))

# def get_all_products():
#     return list(productdetail.find({}, {'_id': 0}))

# def search_products_below_price(max_price):
#     query = {'price': {'$lt': max_price}}
#     return list(productdetail.find(query))

# def get_current_timestamp():
#     return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# def search_products_by_price(user_query, min_price, max_price):
#     query = {
#         'Price': {'$gte': min_price, '$lte': max_price}
#     }
#     matching_products = productdetail.find(query)
#     products_list = list(matching_products)
#     return products_list


# def format_product_details(products):
#     if products:
#         formatted_results = []
#         for i, product in enumerate(products, start=1):
#             formatted_product = f"{i}. a. Product Name: {product['productName']}\n   b. Price: {product['price']}\n   c. Description: {product['description']}"
#             formatted_results.append(formatted_product)
#         return "\n".join(formatted_results)
#     else:
#         return "No products found."


@app.route('/chat', methods=['POST'])
def chat():
    try:
        if request.method == 'POST':
            user_query = request.json.get('message', '').lower()
            user_id = request.json.get('userId', '')
            user_name = request.json.get('userName', '')
            admin_id = g.admin_id  # Assuming admin_id is available in Flask globals

            # Insert user's message into the database
            chat_history_user = {
                "user_id": user_id,
                "user_name": user_name,
                "admin_id": admin_id,
                "role": "user",
                "message": user_query,
                "timestamp": get_current_timestamp()
            }
            demochats.insert_one(chat_history_user)

            # Generate bot's response
            bot_response = generate_bot_response(user_query, user_id, user_name, admin_id)

            # Format bot's response including user's message
            bot_response_with_user_message = f"\n{bot_response}"

            # Insert bot's response into the database
            chat_history_bot = {
                "user_id": user_id,
                "user_name": user_name,
                "admin_id": admin_id,
                "role": "bot",
                "message": bot_response_with_user_message,
                "timestamp": get_current_timestamp()
            }
            demochats.insert_one(chat_history_bot)

            # Return the formatted bot response
            return jsonify({'message': bot_response}), 200
    except Exception as e:
        print('Error:', e)
        response_data = {'message': 'An error occurred. Please try again later.'}
        return jsonify(response_data), 500

def generate_bot_response(user_query, user_id, user_name, admin_id):
    if 'product details' in user_query:
        return get_product_details_response()
    elif 'description' in user_query:
        return get_product_description_response(user_query)
    elif 'below' in user_query:
        max_price = extract_price(user_query)
        return get_products_below_price_response(max_price)
    elif 'above' in user_query:
        min_price = extract_price(user_query)
        return get_products_above_price_response(min_price)
    else:
        return "I'm sorry, I didn't understand your query. How can I assist you?"

def get_product_details_response():
    search_results = get_all_products()
    return format_product_details(search_results)

def get_product_description_response(user_query):
    product_name = user_query.split('description of ')[-1]
    product = find_product_by_name(product_name)
    if product:
        return product['description']
    else:
        return "Product not found."

def get_products_below_price_response(max_price):
    matching_products = [p for p in productdetail.find({"price": {"$lt": max_price}})]
    return format_product_details(matching_products)

def get_products_above_price_response(min_price):
    matching_products = [p for p in productdetail.find({"price": {"$gt": min_price}})]
    return format_product_details(matching_products)

def get_all_products():
    return list(productdetail.find())

def get_current_timestamp():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def extract_price(query):
    try:
        # Extract price from the query
        price_str = re.search(r'\d+(\.\d+)?', query).group()
        return float(price_str)
    except:
        return None

def format_product_details(products):
    if products:
        formatted_results = []
        for i, product in enumerate(products, start=1):
            product_details = {
                "Number": i,
                "ProductName": product['productName'],
                "Price": product['price'],
                "Description": product['description']
            }
            formatted_results.append(product_details)
        return formatted_results
    else:
        return {"message": "No products found."}


# Assuming products is a list of product dictionaries
formatted_products = format_product_details(products)
formatted_products_json = json.dumps(formatted_products, indent=4)
print(formatted_products_json)






@app.route('/chat/history', methods=['GET'])
@jwt_required()
def get_chat_history():
    try:
        current_admin_id = get_jwt_identity()
        admin_chat_history = list(demochats.find({"admin_id": current_admin_id}))

        # admins = adminusersinfo.find({}, {'_id': 1, 'name': 1})
        
        total_user_messages = sum(1 for chat in admin_chat_history if chat['role'] == 'user')
        total_bot_messages = sum(1 for chat in admin_chat_history if chat['role'] == 'bot')
        total_no_chats = total_user_messages + total_bot_messages

        user_message_counts = Counter(chat['user_id'] for chat in admin_chat_history if chat['role'] == 'user')
        bot_message_counts = Counter(chat['user_id'] for chat in admin_chat_history if chat['role'] == 'bot')

        daywise_chat_counts = {calendar.day_name[day]: 0 for day in range(7)}
        for chat in admin_chat_history:
            timestamp = datetime.strptime(chat['timestamp'], '%Y-%m-%d %H:%M:%S')
            day_of_week = timestamp.weekday()
            day_name = calendar.day_name[day_of_week]
            daywise_chat_counts[day_name] += 1

        monthwise_chat_counts = {calendar.month_name[month]: 0 for month in range(1, 13)}
        for chat in admin_chat_history:
            timestamp = datetime.strptime(chat['timestamp'], '%Y-%m-%d %H:%M:%S')
            month_name = calendar.month_name[timestamp.month]
            monthwise_chat_counts[month_name] += 1

        user_chat_history_grouped = defaultdict(list)
        for chat in admin_chat_history:
            user_chat_history_grouped[chat['user_name']].append(chat)

        # admin_chat_histories = {}
        # for admin in admins:
        #     admin_id = str(admin['_id'])
        #     admin_name = admin['name']
                
        #     # Retrieve chat history for the current admin
        #     # admin_chat_history = list(demochats.find({"admin_id": admin_id}))

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
                "user_id": chat_history[0]['user_id'],
                "data": formatted_chat_data
            })

        # user_chat_counts = {}
        # for chat in admin_chat_history:
        #     user_id = chat['user_id']
        #     if user_id in user_chat_counts:
        #         user_chat_counts[user_id] += 1
        #     else:
        #         user_chat_counts[user_id] = 1


        admins_chat_history = {}  # Define a dictionary to hold admin chat histories

        admins = adminusersinfo.find({}, {'_id': 1, 'name': 1})  # Retrieve all admin IDs and names
        for admin in admins:
            admin_id = str(admin['_id'])
            admin_name = admin['name']
            chat_history = list(demochats.find({"admin_id": admin_id}))
            admins_chat_history[admin_name] = chat_history

        # admin_chat_histories[admin_id] = {
        #         "admin_name": admin_name,
        #         "chat_history": formatted_chat_history
        #     }

        

       

        response_data = {
            "adminId": current_admin_id,
            "total_user_messages": total_user_messages,
            "total_bot_messages": total_bot_messages,
            "total_no_chats": total_no_chats,
            "user_message_counts": dict(user_message_counts),
            "bot_message_counts": dict(bot_message_counts),
            "daywise_chat_counts": daywise_chat_counts,
            "monthwise_chat_counts": monthwise_chat_counts,
            "chat_history": formatted_chat_history,
            # 'user_chat_counts': user_chat_counts,
            # 'counts':admin_chat_history,
            # 'alladminchats':admin_chat_histories,
            
        }

        # Serialize the response data to JSON using json_util
        json_response = json_util.dumps(response_data)

        return json_response, 200, {'Content-Type': 'application/json'}

    except Exception as e:
        print('Error:', e)
        response_data = {'message': 'An error occurred. Please try again later.'}
        return jsonify(response_data), 500



@app.route('/chat/stats', methods=['GET'])
@jwt_required()
def get_admin_stats():
    try:
        admins = adminusersinfo.find({}, {'_id': 1, 'name': 1})  # Retrieve all admin IDs and names

        total_num_users = 0
        total_today_chats = 0
        total_total_chats = 0

        admin_stats = {}
        daywise_chat_counts = defaultdict(int)
        monthwise_chat_counts = defaultdict(int)
        monthwise_user_counts = defaultdict(set)  # Use set to count unique users per month

        for admin in admins:
            admin_id = str(admin['_id'])
            admin_name = admin['name']

            # Retrieve chat history for the current admin
            admin_chat_history = list(demochats.find({"admin_id": admin_id}))

            # Calculate the number of users
            users = set(chat['user_id'] for chat in admin_chat_history)
            num_users = len(users)
            total_num_users += num_users

            # Calculate the total number of chats
            total_chats = len(admin_chat_history)
            total_total_chats += total_chats

            # Calculate today's current chats
            today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            today_chats = [chat for chat in admin_chat_history if datetime.strptime(
                chat['timestamp'], '%Y-%m-%d %H:%M:%S') >= today]
            num_today_chats = len(today_chats)
            total_today_chats += num_today_chats

            # Update day-wise, month-wise chat counts, and month-wise user counts
            for chat in admin_chat_history:
                timestamp = datetime.strptime(chat['timestamp'], '%Y-%m-%d %H:%M:%S')
                day_name = calendar.day_name[timestamp.weekday()]
                month_name = calendar.month_name[timestamp.month]

                daywise_chat_counts[day_name] += 1
                monthwise_chat_counts[month_name] += 1
                monthwise_user_counts[month_name].add(chat['user_id'])  # Add user to the set

            admin_stats[admin_name] = {
                'admin_id': admin_id,
                'num_users': num_users,
                'total_chats': total_chats,
                'today_chats': num_today_chats
            }

        # Create a separate entity for totals and chat counts in the response
        totals = {
            'num_users': total_num_users,
            'total_chats': total_total_chats,
            'today_chats': total_today_chats
        }

        # Convert defaultdicts to regular dictionaries for JSON serialization
        daywise_chat_counts = dict(daywise_chat_counts)
        monthwise_chat_counts = dict(monthwise_chat_counts)
        
        # Calculate number of users per month
        for month in monthwise_user_counts:
            monthwise_user_counts[month] = len(monthwise_user_counts[month])

        # Ensure that all days and months are present in the response
        all_days = list(calendar.day_name)
        all_months = list(calendar.month_name)

        for day in all_days:
            if day not in daywise_chat_counts:
                daywise_chat_counts[day] = 0

        for month in all_months:
            if month not in monthwise_chat_counts:
                monthwise_chat_counts[month] = 0
            if month not in monthwise_user_counts:
                monthwise_user_counts[month] = 0

        response_data = {
            'admin_stats': admin_stats,
            'daywise_chat_counts': daywise_chat_counts,
            'monthwise_chat_counts': monthwise_chat_counts,
            'monthwise_user_counts': monthwise_user_counts,
            'totals': totals
        }

        return jsonify(response_data), 200

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

@app.route('/admins', methods=['POST'])
@jwt_required()  # Requires JWT authentication for the POST method
def add_admin():
    try:
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
        chatbot_link = f"https://cdeploye.vercel.app/chat/{admin_id}"

        # Update the admin document to include the chatbot link
        adminusersinfo.update_one(
            {'_id': admin_id},
            {'$set': {'chatbot_link': chatbot_link}}
        )
        
        total_admins = adminusersinfo.count_documents({})

        return jsonify({
            'message': 'Admin added successfully',
            'admin_id': str(admin_id),
            'chatbot_link': chatbot_link,
            'total_admins': total_admins
        }), 201
    except Exception as e:
        logging.error(f"Exception occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/admins', methods=['GET'])
def get_admins():
    try:
        admins = list(adminusersinfo.find())
        admins_list = []
        for admin in admins:
            admin['_id'] = str(admin['_id'])  # Convert ObjectId to str
            admins_list.append(admin)

        return jsonify({'admins': admins_list}), 200
    except Exception as e:
        logging.error(f"Exception occurred: {str(e)}")
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


@app.route('/chat/statss', methods=['GET'])
def get_admin_statss():
    try:
        admins = adminusersinfo.find({}, {'_id': 1, 'name': 1})  # Retrieve all admin IDs and names
        total_num_users = 0
        total_today_chats = 0
        total_total_chats = 0
        admin_stats = {}
        monthly_total_chats = defaultdict(int)
        monthly_num_users = defaultdict(int)
        daily_today_chats = defaultdict(int)
        # Initialize monthly dictionaries with correct month names
        for month in range(1, 13):
            month_name = calendar.month_name[month]
            monthly_total_chats[month_name] = 0
            monthly_num_users[month_name] = 0
        # Initialize daily dictionary with correct day names
        for day_index, day_name in enumerate(calendar.day_name):
            daily_today_chats[day_name] = 0
        for admin in admins:
            admin_id = str(admin['_id'])
            admin_name = admin['name']
            admin_chat_history = list(demochats.find({"admin_id": admin_id}))
            users = set(chat['user_id'] for chat in admin_chat_history)
            num_users = len(users)
            total_num_users += num_users
            current_month = datetime.now().strftime('%B')
            current_day = datetime.now().strftime('%A')
            monthly_num_users[current_month] += num_users
            today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            today_chats = [chat for chat in admin_chat_history if datetime.strptime(chat['timestamp'], '%Y-%m-%d %H:%M:%S') >= today]
            num_today_chats = len(today_chats)
            total_today_chats += num_today_chats
            daily_today_chats[current_day] += num_today_chats
            for chat in admin_chat_history:
                chat_month = datetime.strptime(chat['timestamp'], '%Y-%m-%d %H:%M:%S').strftime('%B')
                monthly_total_chats[chat_month] += 1
            total_chats = len(admin_chat_history)
            total_total_chats += total_chats
            admin_stats[admin_name] = {
                'admin_id': admin_id,
                'num_users': num_users,
                'total_chats': total_chats,
                'today_chats': num_today_chats
            }
        # No need to sort monthly and daily dictionaries
        # Adding totals to the admin stats
        admin_stats['Insights'] = {
            'num_users': monthly_num_users,
            'total_chats': monthly_total_chats,
            'today_chats': daily_today_chats
        }
        admin_stats['totals'] = {
            'num_users': total_num_users,
            'total_chats': total_total_chats,
            'today_chats': total_today_chats
        }
        return jsonify(admin_stats), 200
    except Exception as e:
        print('Error:', e)
        response_data = {'message': 'An error occurred. Please try again later.'}
        return jsonify(response_data), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
    print(f"The Flask app is running on port: {app.url_map.port}")