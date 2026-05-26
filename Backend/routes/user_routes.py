from flask import Blueprint, jsonify, request
from data.users import users

user_bp = Blueprint("user_bp", __name__)

# GET ALL USERS
@user_bp.route("/users", methods=["GET"])
def get_users():
    return jsonify(users), 200


# GET SINGLE USER BY ID
@user_bp.route("/users/<int:id>", methods=["GET"])
def get_user(id):

    user = next((user for user in users if user["id"] == id), None)

    if user:
        return jsonify(user), 200

    return jsonify({
        "error": "User not found"
    }), 404


# POST NEW USER
@user_bp.route("/users", methods=["POST"])
def create_user():

    data = request.get_json()

    required_fields = [
        "name",
        "email",
        "role",
        "bio",
        "company",
        "website"
    ]

    # VALIDATION
    for field in required_fields:
        if field not in data or data[field] == "":
            return jsonify({
                "error": f"{field} is required"
            }), 400

    new_user = {
        "id": len(users) + 1,
        "name": data["name"],
        "email": data["email"],
        "role": data["role"],
        "bio": data["bio"],
        "company": data["company"],
        "website": data["website"]
    }

    users.append(new_user)

    return jsonify({
        "message": "User created successfully",
        "user": new_user
    }), 201


