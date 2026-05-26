from flask import Flask
from routes.user_routes import user_bp

app = Flask(__name__)

# REGISTER ROUTES
app.register_blueprint(user_bp)

# HOME ROUTE
@app.route("/")
def home():
    return {
        "message": "User Profile Backend API Running"
    }

if __name__ == "__main__":
    app.run(debug=True)
