# Employee Management System Backend

## Tech Stack
- FastAPI
- Python

## Features
- GET All Employees
- GET Employee By ID
- Proper MVC Architecture
- Mock JSON Data
- Clean Folder Structure

## Installation

### Create Virtual Environment
python -m venv venv

### Activate Environment

Windows:
venv\Scripts\activate

Mac/Linux:
source venv/bin/activate

### Install Dependencies
pip install -r requirements.txt

### Run Server
uvicorn run:app --reload

## API Endpoints

### Get All Employees
GET /employees

### Get Employee By ID
GET /employees/1