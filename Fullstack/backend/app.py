from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = "users.json"

# -----------------------------
# Load Users
# -----------------------------
def load_users():

     # If local file exists
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as file:
            return json.load(file)
   

    # First time → fetch from API
    response = requests.get(
        "https://jsonplaceholder.typicode.com/users"
    )

    users = response.json()

    roles = [
        "Developer",
        "Designer",
        "Manager"
    ]

    # Add roles
    for index, user in enumerate(users):
        user["role"] = roles[index % len(roles)]

    save_users(users)

    return users


# -----------------------------
# Save Users
# -----------------------------
def save_users(users):
    with open(DATA_FILE, "w") as file:
        json.dump(users, file, indent=4)


users = load_users()

# -----------------------------
# GET ALL USERS
# -----------------------------
@app.route("/users", methods=["GET"])
def get_users():
    return jsonify(users)


# -----------------------------
# ADD USER
# -----------------------------
@app.route("/users", methods=["POST"])
def add_user():

    data = request.get_json()

    new_user = {
        "id": len(users) + 1,
        "name": data["name"],
        "email": data["email"],
        "role": data["role"]
    }

    users.append(new_user)

    return jsonify({
        "message": "User added successfully",
        "user": new_user
    })


# -----------------------------
# UPDATE USER
# -----------------------------
@app.route("/users/<int:id>", methods=["PUT"])
def update_user(id):

    updated_data = request.json

    for user in users:

        if user["id"] == id:

            user["name"] = updated_data["name"]
            user["email"] = updated_data["email"]
            user["role"] = updated_data["role"]
            user["company"] = updated_data["company"]

            save_users(users)

            return jsonify({
                "message": "User updated successfully"
            })

    return jsonify({
        "message": "User not found"
    }), 404


# -----------------------------
# DELETE USER
# -----------------------------
@app.route("/users/<int:id>", methods=["DELETE"])
def delete_user(id):

    global users

    users = [user for user in users if user["id"] != id]

    save_users(users)

    return jsonify({
        "message": "User deleted successfully"
    })


if __name__ == "__main__":
    app.run(debug=True)