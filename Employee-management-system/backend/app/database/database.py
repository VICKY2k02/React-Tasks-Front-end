import requests

from app.config.settings import BASE_API_URL

def fetch_employee_data():

    response = requests.get(BASE_API_URL)

    return response.json()