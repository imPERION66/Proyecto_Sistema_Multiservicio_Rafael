package multiservicioRafael.invenatario.repository;

import multiservicioRafael.invenatario.config.ConexionDB;
import multiservicioRafael.invenatario.repository.Interfaces.LoginDaoInterface;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import multiservicioRafael.invenatario.modal.Usuario;

public class LoginDao implements LoginDaoInterface {

    @Override
    public Usuario validando(String usuario_1, String password) {
        String sql = "SELECT * FROM public.fn_login(?, ?)";
        try (Connection conexion = ConexionDB.getInstance().getConnection();
             PreparedStatement cs = conexion.prepareStatement(sql)) {
            cs.setString(1, usuario_1);
            cs.setString(2, password);
            try (ResultSet rs = cs.executeQuery()) {
                if (rs.next()) {
                    String user = rs.getString("usuario_nombre");
                    if ("ERROR".equalsIgnoreCase(user) || user == null) {
                        return null;
                    }
                    String trabajadorCompleto = rs.getString("trabajador_completo");
                    String rolNombre = rs.getString("rol_nombre");
                    java.sql.Array arraySql = rs.getArray("lista_menues");
                    String[] menus = (arraySql != null) ? (String[]) arraySql.getArray() : new String[0];
                    String nombre = "";
                    String apellidoPat = "";
                    String apellidoMat = "";
                    if (trabajadorCompleto != null && !trabajadorCompleto.isBlank()) {
                        String[] partes = trabajadorCompleto.split(",\\s*", -1);
                        if (partes.length >= 1) nombre = partes[0].trim();
                        if (partes.length >= 2) apellidoPat = partes[1].trim();
                        if (partes.length >= 3) apellidoMat = partes[2].trim();
                    }
                    return new Usuario(user, rolNombre, menus, nombre, apellidoMat, apellidoPat);
                }
            }
        } catch (Exception e) {
            System.err.println("Error en validando para usuario [" + usuario_1 + "]: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public String recuperar_contrasena(String usuario) {
        if (usuario == null || usuario.trim().isEmpty()) {
            return "ERROR";
        }
        String u = usuario.trim();

        try (Connection conexion = ConexionDB.getInstance().getConnection()) {
            // Intento 1: Función almacenada fn_obtener_correo_usuario
            String sqlFn = "SELECT * FROM public.fn_obtener_correo_usuario(?)";
            try (PreparedStatement cs = conexion.prepareStatement(sqlFn)) {
                cs.setString(1, u);
                try (ResultSet rs = cs.executeQuery()) {
                    if (rs.next()) {
                        String estado = rs.getString("estado");
                        String correo = rs.getString("correo");
                        if ("OK".equalsIgnoreCase(estado) && correo != null && !correo.isBlank()) {
                            System.out.println("fn_obtener_correo_usuario resolvió correo: " + correo);
                            return correo.trim();
                        }
                    }
                }
            } catch (Exception eFn) {
                System.out.println("Aviso fn_obtener_correo_usuario (" + eFn.getMessage() + "), usando fallback directo...");
            }

            // Intento 2: Consulta SQL directa con JOIN a trabajador
            String sqlDirect = "SELECT t.correo FROM public.usuario u " +
                               "JOIN public.trabajador t ON u.id_trabajador = t.id_trabajador " +
                               "WHERE u.usuario = ? AND (u.estado = 'Activo' OR u.estado IS NULL)";
            try (PreparedStatement ps = conexion.prepareStatement(sqlDirect)) {
                ps.setString(1, u);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        String correo = rs.getString("correo");
                        if (correo != null && !correo.isBlank()) {
                            System.out.println("Fallback SQL directo resolvió correo: " + correo);
                            return correo.trim();
                        }
                    }
                }
            }

            // Intento 3: Consulta por DNI si el usuario es el número de documento
            String sqlDni = "SELECT t.correo FROM public.trabajador t " +
                            "WHERE t.nro_documento = ? AND (t.estado = 'Activo' OR t.estado IS NULL)";
            try (PreparedStatement psDni = conexion.prepareStatement(sqlDni)) {
                psDni.setString(1, u);
                try (ResultSet rs = psDni.executeQuery()) {
                    if (rs.next()) {
                        String correo = rs.getString("correo");
                        if (correo != null && !correo.isBlank()) {
                            System.out.println("Fallback DNI trabajador resolvió correo: " + correo);
                            return correo.trim();
                        }
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("Error crítico en recuperar_contrasena para [" + u + "]: " + e.getMessage());
            e.printStackTrace();
        }
        return "ERROR";
    }

    @Override
    public String actualizarcontraseña(String usuario, String contrasena) {
        String sql = "SELECT fn_actualizar_contrasena(?, ?)";
        try (Connection conexion = ConexionDB.getInstance().getConnection(); PreparedStatement cs = conexion.prepareStatement(sql)) {
            cs.setString(1, usuario);
            cs.setString(2, contrasena);
            try (ResultSet rs = cs.executeQuery()) {
                if (rs.next()) {
                    return rs.getString(1);
                }
            }
        } catch (Exception e) {
            System.err.println("Error en actualizarcontraseña: " + e.getMessage());
            e.printStackTrace();
        }
        return "ERROR";
    }

    @Override
    public String resetearContrasena(String usuario) {
        String sql = "SELECT fn_reset_contrasena(?)";
        try (Connection conexion = ConexionDB.getInstance().getConnection(); PreparedStatement cs = conexion.prepareStatement(sql)) {
            cs.setString(1, usuario);
            try (ResultSet rs = cs.executeQuery()) {
                if (rs.next()) {
                    return rs.getString(1);
                }
            }
        } catch (Exception e) {
            System.err.println("Error en resetearContrasena: " + e.getMessage());
            e.printStackTrace();
        }
        return "ERROR";
    }
}