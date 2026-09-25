package multiservicioRafael.invenatario.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

public class ConexionDB {
    private static ConexionDB conexion;
    private HikariDataSource dataSource;

    private ConexionDB() {
        inicializarPool();
    }

    private synchronized void inicializarPool() {
        if (this.dataSource != null && !this.dataSource.isClosed()) {
            return;
        }

        try {
            Properties properties = multiservicioRafael.invenatario.config.EnvLoader.loadProperties();

            String jdbcUrl = properties.getProperty("url");
            String username = properties.getProperty("user");
            String password = properties.getProperty("password");

            // Auto-corrección inteligente de credenciales Supabase
            if (jdbcUrl != null) {
                if (jdbcUrl.contains("pooler.supabase.com")) {
                    if (username != null && !username.contains(".")) {
                        username = "postgres.hugqmdsfjprzaaopzjcl";
                    }
                    if (!jdbcUrl.contains("prepareThreshold=0")) {
                        jdbcUrl += (jdbcUrl.contains("?") ? "&" : "?") + "prepareThreshold=0";
                    }
                } else if (jdbcUrl.contains("db.hugqmdsfjprzaaopzjcl.supabase.co")) {
                    if (username != null && username.contains(".")) {
                        username = "postgres";
                    }
                }
                if (!jdbcUrl.contains("sslmode=") && !jdbcUrl.contains("localhost")) {
                    jdbcUrl += (jdbcUrl.contains("?") ? "&" : "?") + "sslmode=require";
                }
            }

            System.out.println("------------------------------------------------------------");
            System.out.println("Configurando HikariCP:");
            System.out.println("  JDBC URL: " + (jdbcUrl != null ? jdbcUrl.replaceAll("password=[^&]*", "password=****") : "NULL"));
            System.out.println("  Username: " + username);
            System.out.println("------------------------------------------------------------");

            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(jdbcUrl);
            config.setUsername(username);
            config.setPassword(password);
            config.setDriverClassName("org.postgresql.Driver");

            config.setMaximumPoolSize(10);
            config.setMinimumIdle(1);
            config.setConnectionTimeout(30000);   // 30 segundos
            config.setIdleTimeout(120000);        // 2 minutos
            config.setMaxLifetime(1800000);       // 30 minutos
            config.setKeepaliveTime(30000);       // 30 segundos
            config.setInitializationFailTimeout(-1); // No crashear en arranque si la BD está en cold-start
            config.setConnectionTestQuery("SELECT 1");

            this.dataSource = new HikariDataSource(config);
            System.out.println("Pool HikariCP inicializado correctamente.");
        } catch (Exception e) {
            System.err.println("Error al inicializar HikariDataSource: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static synchronized ConexionDB getInstance() {
        if (conexion == null) {
            conexion = new ConexionDB();
        }
        return conexion;
    }

    public Connection getConnection() throws SQLException {
        if (this.dataSource == null || this.dataSource.isClosed()) {
            System.out.println("Reintentando inicializar Pool HikariCP...");
            inicializarPool();
        }
        if (this.dataSource == null) {
            throw new SQLException("El pool de conexiones no se inicializó correctamente. Verifique las credenciales de BD.");
        }
        return this.dataSource.getConnection();
    }
}