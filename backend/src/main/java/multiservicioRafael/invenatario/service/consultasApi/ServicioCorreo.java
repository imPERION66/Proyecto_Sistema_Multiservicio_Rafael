package multiservicioRafael.invenatario.service.consultasApi;

import java.util.Properties;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import multiservicioRafael.invenatario.service.Patrones.RegistroCodigosVerificacion;

public class ServicioCorreo {

    private static ServicioCorreo instancia;
    private final Properties config;

    private ServicioCorreo() {
        config = cargarConfiguracion();
    }

    public static synchronized ServicioCorreo getInstancia() {
        if (instancia == null) {
            instancia = new ServicioCorreo();
        }
        return instancia;
    }

    public boolean enviarCodigoVerificacion(String correoDestino, String codigo) {
        int minutos = RegistroCodigosVerificacion.getInstancia().getMinutosValidez();
        String remitente = config.getProperty("brevo.smtp.from", "cruzvasquezyhomar@gmail.com");
        String user = config.getProperty("brevo.smtp.user", "bb0ac3001@smtp-brevo.com");
        String pass = config.getProperty("brevo.smtp.password", "xsmtpsib-ed621b3edc8e40444fdf52327e5e922d1ddb3526ac8f6989eac657e24ce89ce8-GHrfWyqVptubU0ci");
        String host = config.getProperty("brevo.smtp.host", "smtp-relay.brevo.com");

        String html = """
            <div style="max-width:600px;margin:auto;padding:35px;background:#ffffff;border:1px solid #dddddd;border-radius:12px;font-family:Arial;">
                <h1 style="text-align:center;color:#1565C0;">🔐 Multiservicio Rafael</h1>
                <p>Hola,</p>
                <p>Usa el siguiente código para verificar tu cuenta:</p>
                <div style="background:#F3F6FF;padding:20px;text-align:center;border-radius:10px;">
                    <span style="font-size:34px;font-weight:bold;color:#1565C0;letter-spacing:6px;">%s</span>
                </div>
                <p>Este código es válido por <strong>%d minutos</strong>.</p>
                <p>Si no realizaste esta solicitud, ignora este mensaje.</p>
                <hr>
                <p style="color:#777">Gracias por confiar en nosotros.<br>Equipo Multiservicio Rafael</p>
            </div>
            """.formatted(codigo, minutos);

        String[] portsToTry = {"587", "2525", "465"};
        for (String port : portsToTry) {
            try {
                System.out.println("Intentando enviar correo a " + correoDestino + " por puerto " + port + "...");
                Properties props = new Properties();
                props.put("mail.smtp.auth", "true");
                props.put("mail.smtp.host", host);
                props.put("mail.smtp.port", port);
                props.put("mail.smtp.connectiontimeout", "8000");
                props.put("mail.smtp.timeout", "8000");
                props.put("mail.smtp.ssl.protocols", "TLSv1.2 TLSv1.3");
                props.put("mail.smtp.ssl.trust", "*");

                if ("465".equals(port)) {
                    props.put("mail.smtp.ssl.enable", "true");
                    props.put("mail.smtp.socketFactory.port", "465");
                    props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
                } else {
                    props.put("mail.smtp.starttls.enable", "true");
                    props.put("mail.smtp.starttls.required", "true");
                }

                Session session = Session.getInstance(props, new javax.mail.Authenticator() {
                    @Override
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(user, pass);
                    }
                });

                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress(remitente, "Multiservicios Rafael"));
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(correoDestino));
                message.setSubject("🔐 Código de verificación - Multiservicios Rafael");
                message.setContent(html, "text/html; charset=utf-8");

                Transport.send(message);
                System.out.println("Correo enviado exitosamente vía puerto " + port);
                return true;
            } catch (Exception e) {
                System.err.println("Fallo envío por puerto " + port + ": " + e.getMessage());
            }
        }
        return false;
    }

    private Properties cargarConfiguracion() {
        return multiservicioRafael.invenatario.config.EnvLoader.loadProperties();
    }
}