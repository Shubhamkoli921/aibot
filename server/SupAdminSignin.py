from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

# Set your OpenAI API key
openai.api_key = "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"

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

if __name__ == '__main__':
    app.run(debug=True)
