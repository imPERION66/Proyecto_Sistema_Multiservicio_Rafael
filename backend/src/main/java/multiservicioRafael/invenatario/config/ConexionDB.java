package multiservicioRafael.invenatario.config;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

public class ConexionDB {
    private static ConexionDB conexion;
    private HikariDataSource dataSource; 

    private ConexionDB() {
        Properties properties = multiservicioRafael.invenatario.config.EnvLoader.loadProperties();

        String jdbcUrl = properties.getProperty("url");
        String username = properties.getProperty("user");
        String password = properties.getProperty("password");

        System.out.println("Inicializando Pool HikariCP con JDBC URL: " + (jdbcUrl != null ? jdbcUrl.replaceAll("password=[^&]*", "password=****") : "NULL"));
        System.out.println("Usuario BD configurado: " + username);

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("org.postgresql.Driver");

        config.setMaximumPoolSize(10);        
        config.setMinimumIdle(1);
        config.setConnectionTimeout(30000);   // 30 segundos para soportar cold starts
        config.setIdleTimeout(120000);        // 2 minutos
        config.setMaxLifetime(1800000);       // 30 minutos
        config.setKeepaliveTime(30000);       // 30 segundos para evitar cortes de firewall
        config.setConnectionTestQuery("SELECT 1"); 

        try {
            this.dataSource = new HikariDataSource(config);
            System.out.println("Pool HikariCP inicializado correctamente.");
        } catch (Exception e) {
            System.err.println("Error crítico al inicializar HikariDataSource: " + e.getMessage());
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
        if (this.dataSource == null) {
            throw new SQLException("El pool de conexiones no se inicializó correctamente.");
        }
        return this.dataSource.getConnection();
    }
}