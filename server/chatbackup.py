# def chat():
#     if request.method == 'GET':
#         try:
#             initial_message = "Hello! I'm Chatbot.ai. Please provide your name to start the conversation."
#             return jsonify({'message': initial_message})
#         except Exception as e:
#             print('Error:', e)
#             response_data = {'message': 'An error occurred. Please try again later.'}
#             return jsonify(response_data), 500
#     elif request.method == 'POST':
#         try:
#             user_query = request.json.get('message', '').lower()
#             user_id = request.json.get('userId', '')
#             user_name = request.json.get('userName', '')
#             admin_id = g.admin_id

#             if 'product' in user_query and 'details' in user_query:
#                 product_response = handle_chat_commands(user_query, admin_id)
#                 return jsonify({'message': product_response, 'admin_id': admin_id}), 200
#             else:
#                 chat_history_user = {
#                     "user_id": user_id,
#                     "user_name": user_name,
#                     "admin_id": admin_id,
#                     "role": "user",
#                     "message": user_query,
#                     "timestamp": get_current_timestamp()
#                 }
#                 demochats.append(chat_history_user)

#                 bot_response = handle_chat_commands(user_query, admin_id)

#                 if isinstance(bot_response, str):  # Check if bot_response is a string
#                     bot_response = [bot_response]

#                 chat_history_bot = {
#                     "user_id": user_id,
#                     "user_name": user_name,
#                     "admin_id": admin_id,
#                     "role": "bot",
#                     "message": bot_response,
#                     "timestamp": get_current_timestamp()
#                 }
#                 demochats.append(chat_history_bot)

#                 response_data = {
#                     'message': bot_response,
#                     'admin_id': admin_id
#                 }
#                 return jsonify(response_data), 200

#         except Exception as e:
#             print('Error:', e)
#             response_data = {'message': 'An error occurred. Please try again later.'}
#             return jsonify(response_data), 500


# def handle_chat_commands(user_query, admin_id):
#     if 'product' in user_query and 'details' in user_query:
#         # Query the database or any other data source to retrieve product details
#         product_details = "Here are the details of our products:\nProduct A: $100\nProduct B: $200"
#         return product_details
#     else:
#         # If the user's query doesn't match any predefined commands, provide a default response
#         return "I'm sorry, I didn't understand that. Can you please rephrase your query?"


@app.route('/chat', methods=['GET', 'POST'])
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
            # current_user = get_jwt_identity()
            user_query = request.json.get('message', '').lower()
            user_id = request.json.get('userId', '')
            user_name = request.json.get('userName', '')
            admin_id = g.admin_id # Assigning current_user directly to admin_id
            chat_history_user = {
                "user_id": user_id,
                "user_name": user_name,
                "admin_id": admin_id,
                "role": "user",
                "message": user_query,
                "timestamp": get_current_timestamp()
            }
            demochats.insert_one(chat_history_user)
            # Search for products if the user query contains keywords related to product search
            if 'product' in user_query or 'price' in user_query:
                # Extract price range from user query
                min_price = None
                max_price = None
                for token in user_query.split():
                    if token.isdigit():
                        if not min_price:
                            min_price = int(token)
                        elif not max_price:
                            max_price = int(token)
                # Search products based on price range
                search_results = search_products_by_price(user_query, min_price, max_price)
                if search_results:
                    # Format search results for display
                    formatted_results = []
                    for product in search_results:
                        formatted_product = {
                            'productName': product['productName'],
                            'price': product['price'],
                            'description': product['description']
                        }
                        formatted_results.append(formatted_product)
                    bot_response = f"Here are the matching products:\n{formatted_results}"
                else:
                    bot_response = "No products found matching your criteria."
            # response = openai.Completion.create(
            #     engine="gpt-3.5-turbo-instruct",
            #     prompt=f"User: {user_query}\nChatbot:",
            #     temperature=0.7,
            #     max_tokens=150,
            #     )
            # bot_response = response['choices'][0]['text']
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

def get_current_timestamp():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def search_products_by_price(user_query, min_price, max_price):
    # Define the query to search for products within the specified price range
    query = {
        'Price': {'$gte': min_price, '$lte': max_price}
    }

    # Execute the query to find products matching the criteria
    matching_products = productdetail.find(query)

    # Convert the MongoDB cursor to a list of dictionaries
    products_list = list(matching_products)

    return products_list


# new chat 


@app.route('/chat', methods=['POST'])
def chat():
    if request.method == 'POST':
        try:
            user_query = request.json.get('message', '').lower()
            user_id = request.json.get('userId', '')
            user_name = request.json.get('userName', '')
            admin_id = g.admin_id

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

            # Format bot response as JSON
            bot_response_json = jsonify({
                'message': bot_response_with_user_message,
                'admin_id': admin_id
            })

            return bot_response_json, 200
        except Exception as e:
            print('Error:', e)
            response_data = {'message': 'An error occurred. Please try again later.'}
            return jsonify(response_data), 500

def generate_bot_response(user_query, user_id, user_name, admin_id):
    if 'product details' in user_query:
        return get_product_details_response()
    elif 'below' in user_query and any(char.isdigit() for char in user_query):
        return get_products_below_price_response(user_query)
    else:
        return get_products_by_name_response(user_query)

def get_product_details_response():
    search_results = get_all_products()
    return format_product_details(search_results)

def get_products_below_price_response(user_query):
    max_price = extract_price(user_query)
    if max_price:
        search_results = search_products_below_price(max_price)
        if search_results:
            return format_product_details(search_results)
        else:
            return "No products found below the specified price."
    else:
        return "Please specify a valid price to search for products below."

def get_products_by_name_response(user_query):
    search_results = search_products_by_name(user_query)
    if search_results:
        return format_product_details(search_results)
    else:
        return "No products found matching your search criteria."

def extract_price(query):
    try:
        price_str = query.split('below')[-1].strip()
        return float(price_str)
    except ValueError:
        return None

def format_product_details(products):
    if products:
        formatted_results = []
        for product in products:
            formatted_product = {
                'productName': product['productName'],
                'price': product['price'],
                'description': product['description']
            }
            formatted_results.append(formatted_product)
        return formatted_results
    else:
        return "No products found."

def search_products_by_name(product_name):
    query = {"productName": {"$regex": product_name, "$options": "i"}}
    return list(productdetail.find(query))

def get_all_products():
    return list(productdetail.find({}, {'_id': 0}))

def search_products_below_price(max_price):
    query = {'price': {'$lt': max_price}}
    return list(productdetail.find(query))

def get_current_timestamp():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def search_products_by_price(user_query, min_price, max_price):
    query = {
        'Price': {'$gte': min_price, '$lte': max_price}
    }
    matching_products = productdetail.find(query)
    products_list = list(matching_products)
    return products_list