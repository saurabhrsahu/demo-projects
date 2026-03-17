from fastapi import FastAPI
import os

service_name = os.getenv("SERVICE_NAME", "python-microservice")

app = FastAPI(title=service_name)


@app.get("/")
def root():
    return {"service": service_name, "message": "Hello from the Python microservice"}


@app.get("/healthz")
def healthz():
    return {"status": "ok", "service": service_name}


@app.get("/readyz")
def readyz():
    return {"status": "ready", "service": service_name}


def run():
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=False,
    )


if __name__ == "__main__":
    run()

