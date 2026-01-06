# 1. A Base: Usamos o Eclipse Temurin (o Java moderno padrão) versão 21
FROM eclipse-temurin:21-jdk-jammy

# 2. A Pasta: Criamos uma pasta de trabalho dentro do container
WORKDIR /app

# 3. O Ingrediente: Copiamos o seu .jar gerado para dentro do container
COPY target/*.jar app.jar

# 4. A Porta: Avisamos ao Docker que esse app usa a porta 8080
EXPOSE 8080

# 5. O Comando: O que rodar quando a marmita abrir
ENTRYPOINT ["java", "-jar", "app.jar"]