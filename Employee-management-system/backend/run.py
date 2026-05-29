# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# from app.database.connection import engine, Base
# from app.routes.employee_routes import router

# from app.routes.auth_routes import router
# # CREATE TABLES
# Base.metadata.create_all(bind=engine)

# app = FastAPI()

# # CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ROUTES
# app.include_router(router)

# # SUCCESS MESSAGE
# @app.on_event("startup")
# def startup_event():
#     print("Backend Successfully Running...")

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import engine, Base

from app.routes.employee_routes import router as employee_router

from app.routes.auth_routes import router as auth_router


# CREATE TABLES
Base.metadata.create_all(bind=engine)

app = FastAPI()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# EMPLOYEE ROUTES
app.include_router(employee_router)

# AUTH ROUTES
app.include_router(auth_router)


# SUCCESS MESSAGE
@app.on_event("startup")
def startup_event():

    print("Backend Successfully Running...")