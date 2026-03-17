FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY pyproject.toml ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir "fastapi>=0.115.0" "uvicorn[standard]>=0.30.0"

COPY app ./app

ENV PORT=8000
ENV SERVICE_NAME=python-microservice

EXPOSE 8000

CMD ["python", "-m", "app.main"]

