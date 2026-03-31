# Build fat jar (Open-Meteo client demo — https://open-meteo.com/)
# Tag list: https://hub.docker.com/r/sbtscala/scala-sbt/tags
FROM sbtscala/scala-sbt:eclipse-temurin-alpine-21.0.8_9_1.11.4_3.3.6 AS build
WORKDIR /app
COPY build.sbt ./
COPY project ./project
COPY src ./src
RUN sbt assembly

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/scala-3.3.4/scala-weather.jar /app/app.jar
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
