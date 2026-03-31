FROM golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod ./
COPY main.go ./
ENV CGO_ENABLED=0
RUN go build -trimpath -ldflags="-s -w" -o /out/server .

FROM gcr.io/distroless/static-debian12:nonroot
WORKDIR /
COPY --from=build /out/server /server
ENV PORT=8080
ENV SERVICE_NAME=go-greet
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/server"]
