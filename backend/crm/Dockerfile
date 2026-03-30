# Dockerfile para desarrollo Java con Spring Boot
# Usa Java 17 JDK con Maven

FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Directorio de trabajo
WORKDIR /app

# Copiar solo el pom.xml primero para aprovechar cache de capas
COPY pom.xml .

# Descargar dependencias
RUN mvn dependency:go-offline -B

# Copiar el código fuente
COPY src ./src

# Compilar la aplicación
RUN mvn clean package -DskipTests -B

# Imagen de runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar el jar compilado desde el builder
COPY --from=builder /app/target/*.jar app.jar

# Exponer puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
