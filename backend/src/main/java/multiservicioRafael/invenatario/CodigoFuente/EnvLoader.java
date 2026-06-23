package multiservicioRafael.invenatario.CodigoFuente;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
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

        // Cargar variables desde archivo .env local si existe
        loadDotEnv(properties);

        // Sobrescribir con variables de entorno del sistema
        overrideWithEnv(properties);
        return properties;
    }

    private static void loadDotEnv(Properties properties) {
        // Buscar el archivo .env en varias ubicaciones posibles
        File envFile = new File(".env");
        if (!envFile.exists()) {
            envFile = new File("backend/.env");
        }
        if (!envFile.exists()) {
            envFile = new File("backend_inventario/.env");
        }
        
        if (envFile.exists()) {
            try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) {
                        continue;
                    }
                    int equalsIdx = line.indexOf('=');
                    if (equalsIdx > 0) {
                        String envKey = line.substring(0, equalsIdx).trim();
                        String envValue = line.substring(equalsIdx + 1).trim();
                        
                        // Quitar comillas si están presentes
                        if ((envValue.startsWith("\"") && envValue.endsWith("\"")) ||
                            (envValue.startsWith("'") && envValue.endsWith("'"))) {
                            envValue = envValue.substring(1, envValue.length() - 1);
                        }
                        
                        // Convertir la clave de ENV_VAR a propiedad del sistema
                        String propKey = envToPropKey(envKey);
                        if (propKey != null) {
                            properties.setProperty(propKey, envValue);
                        }
                    }
                }
            } catch (IOException e) {
                System.err.println("Error al cargar el archivo .env: " + e.getMessage());
            }
        }
    }

    private static String envToPropKey(String envKey) {
        switch (envKey) {
            case "DB_URL": return "url";
            case "DB_USER": return "user";
            case "DB_PASSWORD": return "password";
            case "BREVO_SMTP_HOST": return "brevo.smtp.host";
            case "BREVO_SMTP_PORT": return "brevo.smtp.port";
            case "BREVO_SMTP_USER": return "brevo.smtp.user";
            case "BREVO_SMTP_PASSWORD": return "brevo.smtp.password";
            case "BREVO_SMTP_FROM": return "brevo.smtp.from";
            case "APISPERU_API_KEY": return "apisperu.api.key";
            case "APISPERU_RUC_API_KEY": return "apisperu.ruc.api.key";
            default:
                return envKey.toLowerCase().replace('_', '.');
        }
    }

    private static void overrideWithEnv(Properties properties) {
        // Claves conocidas para asegurar que se carguen incluso si el properties está vacío
        String[] keys = {
            "url", "user", "password",
            "brevo.smtp.host", "brevo.smtp.port", "brevo.smtp.user", "brevo.smtp.password", "brevo.smtp.from",
            "apisperu.api.key", "apisperu.ruc.api.key"
        };
        for (String key : keys) {
            String envName = key.replace('.', '_').toUpperCase();
            String envValue = System.getenv(envName);
            if (envValue != null && !envValue.isEmpty()) {
                properties.setProperty(key, envValue);
            }
        }

        // Mapear también variables estándar de bases de datos
        String dbUrl = System.getenv("DB_URL");
        if (dbUrl != null && !dbUrl.isEmpty()) {
            properties.setProperty("url", dbUrl);
        }
        String dbUser = System.getenv("DB_USER");
        if (dbUser != null && !dbUser.isEmpty()) {
            properties.setProperty("user", dbUser);
        }
        String dbPassword = System.getenv("DB_PASSWORD");
        if (dbPassword != null && !dbPassword.isEmpty()) {
            properties.setProperty("password", dbPassword);
        }
        
        // Procesar cualquier otra propiedad cargada dinámicamente desde el archivo o .env
        for (String name : properties.stringPropertyNames()) {
            String envName = name.replace('.', '_').toUpperCase();
            String envValue = System.getenv(envName);
            if (envValue != null && !envValue.isEmpty()) {
                properties.setProperty(name, envValue);
            }
        }
    }
}
