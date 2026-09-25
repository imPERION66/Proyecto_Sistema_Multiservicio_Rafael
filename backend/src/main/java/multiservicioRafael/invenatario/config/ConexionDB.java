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

            // Si las credenciales no vinieron cargadas, asignar por defecto las de Supabase
            if (jdbcUrl == null || jdbcUrl.isBlank()) {
                jdbcUrl = "jdbc:postgresql://aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0";
            }
            if (username == null || username.isBlank()) {
                username = "postgres.hugqmdsfjprzaaopzjcl";
            }
            if (password == null || password.isBlank()) {
                password = "Rafael#.cixbd@";
            }

            // Sanitizar URL: Eliminar parámetros user y password embebidos en la query string
            jdbcUrl = jdbcUrl.replaceAll("([?&])user=[^&]*(&|$)", "$1")
                             .replaceAll("([?&])password=[^&]*(&|$)", "$1")
                             .replaceAll("\\?&", "?")
                             .replaceAll("[?&]$", "");

            // Supabase Direct (db.*.supabase.co:5432) es IPv6 y falla en Render (IPv4).
            // Redirigir siempre de forma transparente al Pooler IPv4 de Supabase:
            if (jdbcUrl.contains("db.hugqmdsfjprzaaopzjcl.supabase.co") || jdbcUrl.contains(".supabase.co:5432")) {
                jdbcUrl = "jdbc:postgresql://aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0";
                username = "postgres.hugqmdsfjprzaaopzjcl";
            } else if (jdbcUrl.contains("pooler.supabase.com")) {
                username = "postgres.hugqmdsfjprzaaopzjcl";
                if (!jdbcUrl.contains("prepareThreshold=0")) {
                    jdbcUrl += (jdbcUrl.contains("?") ? "&" : "?") + "prepareThreshold=0";
                }
            }

            if (!jdbcUrl.contains("sslmode=") && !jdbcUrl.contains("localhost") && !jdbcUrl.contains("127.0.0.1")) {
                jdbcUrl += (jdbcUrl.contains("?") ? "&" : "?") + "sslmode=require";
            }

            System.out.println("------------------------------------------------------------");
            System.out.println("Configurando HikariCP:");
            System.out.println("  JDBC URL: " + jdbcUrl.replaceAll("password=[^&]*", "password=****"));
            System.out.println("  Username: " + username);
            System.out.println("------------------------------------------------------------");

            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(jdbcUrl);
            config.setUsername(username);
            config.setPassword(password);
            config.setDriverClassName("org.postgresql.Driver");

            config.setMaximumPoolSize(10);
            config.setMinimumIdle(1);
            config.setConnectionTimeout(15000);   // 15 segundos
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