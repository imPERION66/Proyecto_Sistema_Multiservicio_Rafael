package multiservicioRafael.invenatario.config;

import java.io.InputStream;
import java.io.IOException;
import java.util.Properties;

public class EnvLoader {
    public static Properties loadProperties() {
        Properties properties = new Properties();
        InputStream input = Thread.currentThread().getContextClassLoader().getResourceAsStream("application.properties");
        if (input == null) {
            input = EnvLoader.class.getClassLoader().getResourceAsStream("application.properties");
        }
        
        if (input != null) {
            try {
                properties.load(input);
            } catch (IOException e) {
                System.err.println("Error al cargar application.properties: " + e.getMessage());
            } finally {
                try {
                    input.close();
                } catch (IOException e) {
                    // Ignorar
                }
            }
        } else {
            System.err.println("Advertencia: No se encontró el archivo application.properties");
        }

        // Sobrescribir con variables de entorno
        overrideWithEnv(properties);
        return properties;
    }

    private static void overrideWithEnv(Properties properties) {
        // Claves conocidas para asegurar que se carguen incluso si el properties está vacío
        String[] keys = {
            "url", "user", "password",
            "brevo.smtp.host", "brevo.smtp.port", "brevo.smtp.user", "brevo.smtp.password", "brevo.smtp.from",
            "apisperu.api.key", "apisperu.ruc.api.key", "server.port"
        };
        for (String key : keys) {
            String envName = key.replace('.', '_').toUpperCase();
            String envValue = System.getenv(envName);
            if (envValue != null && !envValue.isEmpty()) {
                properties.setProperty(key, envValue);
            }
        }

        // Mapear variables estándar de bases de datos
        String dbUrl = System.getenv("DB_URL");
        if (dbUrl == null || dbUrl.isEmpty()) {
            dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        }
        if (dbUrl == null || dbUrl.isEmpty()) {
            dbUrl = System.getenv("DATABASE_URL");
        }
        
        if (dbUrl != null && !dbUrl.isEmpty()) {
            // Si la URL viene en formato postgres:// o postgresql:// convertir a JDBC si es necesario
            if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
                if (!dbUrl.startsWith("jdbc:")) {
                    dbUrl = "jdbc:" + dbUrl;
                }
            }
            if (!dbUrl.contains("sslmode=") && !dbUrl.contains("localhost") && !dbUrl.contains("127.0.0.1")) {
                dbUrl += (dbUrl.contains("?") ? "&" : "?") + "sslmode=require";
            }
            properties.setProperty("url", dbUrl);
        }

        String dbUser = System.getenv("DB_USER");
        if (dbUser == null || dbUser.isEmpty()) {
            dbUser = System.getenv("SPRING_DATASOURCE_USERNAME");
        }
        if (dbUser == null || dbUser.isEmpty()) {
            dbUser = System.getenv("DATABASE_USER");
        }
        if (dbUser != null && !dbUser.isEmpty()) {
            properties.setProperty("user", dbUser);
        }

        String dbPassword = System.getenv("DB_PASSWORD");
        if (dbPassword == null || dbPassword.isEmpty()) {
            dbPassword = System.getenv("SPRING_DATASOURCE_PASSWORD");
        }
        if (dbPassword == null || dbPassword.isEmpty()) {
            dbPassword = System.getenv("DATABASE_PASSWORD");
        }
        if (dbPassword != null && !dbPassword.isEmpty()) {
            properties.setProperty("password", dbPassword);
        }

        // Mapear puerto de servidor dinámico para Render / Dokploy / Docker
        String port = System.getenv("PORT");
        if (port == null || port.isEmpty()) {
            port = System.getenv("SERVER_PORT");
        }
        if (port != null && !port.isEmpty()) {
            properties.setProperty("server.port", port);
        }
        
        // Procesar cualquier otra propiedad cargada dinámicamente desde el archivo
        for (String name : properties.stringPropertyNames()) {
            String envName = name.replace('.', '_').toUpperCase();
            String envValue = System.getenv(envName);
            if (envValue != null && !envValue.isEmpty()) {
                properties.setProperty(name, envValue);
            }
        }
    }
}
