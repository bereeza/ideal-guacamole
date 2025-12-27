FROM maven:3.8.5-amazoncorretto-17 AS build
LABEL authors="bereeeza"
WORKDIR /app
COPY backend/pom.xml .
RUN mvn dependency:go-offline

COPY backend/src ./src
RUN mvn clean package -DskipTests

FROM amazoncorretto:17-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=build /app/target/*.jar app.jar
ENV PROPS="-XX:MaxRAMPercentage=75.0"
ENTRYPOINT ["sh", "-c", "java $PROPS -jar app.jar"]