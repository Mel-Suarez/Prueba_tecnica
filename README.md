# Prueba_tecnica

PASOS PARA EJECUTAR EL PROYECTO

Para limpiar el proyecto:
mvn clean 

Instalar las dependencias necesarias para levantar el proyecto, forzando la limpieza del caché:
mvn clean install -U

Genera el index html inicial para verificar correcta compilación:
mvn verify

Se compila un festure específico:
mvn clean verify -Dtest=FlujoCompraRunner

