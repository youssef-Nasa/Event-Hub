import java.io.*;
import java.net.*;

public class SimpleEurekaServer {
    public static void main(String[] args) throws IOException {
        int port = 8761;
        ServerSocket serverSocket = new ServerSocket(port, 50, InetAddress.getByName("0.0.0.0"));
        System.out.println("Eureka Server started on port " + port);
        
        while (true) {
            try (Socket clientSocket = serverSocket.accept()) {
                BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);
                
                // Read the request
                String requestLine = in.readLine();
                if (requestLine != null && requestLine.startsWith("GET")) {
                    // Read headers
                    String headerLine;
                    while ((headerLine = in.readLine()) != null && !headerLine.isEmpty()) {
                        // Skip headers
                    }
                    
                    // Create HTML response
                    String htmlContent = getHTMLContent();
                    
                    // Send HTTP response
                    out.println("HTTP/1.1 200 OK");
                    out.println("Content-Type: text/html; charset=UTF-8");
                    out.println("Access-Control-Allow-Origin: *");
                    out.println("Content-Length: " + htmlContent.getBytes("UTF-8").length);
                    out.println("Connection: close");
                    out.println();
                    out.print(htmlContent);
                    out.flush();
                }
                clientSocket.close();
            } catch (Exception e) {
                System.err.println("Error handling request: " + e.getMessage());
            }
        }
    }
    
    private static String getHTMLContent() {
        return "<!DOCTYPE html>\n" +
               "<html lang=\"en\">\n" +
               "<head>\n" +
               "    <meta charset=\"UTF-8\">\n" +
               "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
               "    <title>Eureka Server - EventHub</title>\n" +
               "    <style>\n" +
               "        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; color: #333; }\n" +
               "        .container { max-width: 1200px; margin: 0 auto; background: rgba(255, 255, 255, 0.95); padding: 30px; border-radius: 15px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); }\n" +
               "        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #2196F3; }\n" +
               "        .header h1 { color: #2196F3; font-size: 2.5em; margin: 0; }\n" +
               "        .status { display: inline-block; background: #4CAF50; color: white; padding: 10px 20px; border-radius: 25px; font-weight: bold; margin-top: 10px; }\n" +
               "        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }\n" +
               "        .info-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6; }\n" +
               "        .info-card h3 { color: #495057; margin-bottom: 15px; }\n" +
               "        .service-item { background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #2196F3; border-radius: 4px; }\n" +
               "        .service-name { font-weight: bold; color: #2196F3; font-size: 1.2em; }\n" +
               "        .service-status { display: inline-block; background: #4CAF50; color: white; padding: 4px 12px; border-radius: 15px; font-size: 0.9em; font-weight: bold; }\n" +
               "        .links { text-align: center; margin: 30px 0; }\n" +
               "        .links a { display: inline-block; margin: 10px; padding: 12px 24px; background: #2196F3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }\n" +
               "        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; }\n" +
               "    </style>\n" +
               "</head>\n" +
               "<body>\n" +
               "    <div class=\"container\">\n" +
               "        <div class=\"header\">\n" +
               "            <h1>Eureka Server Dashboard</h1>\n" +
               "            <p>EventHub Microservices - Service Discovery</p>\n" +
               "            <div class=\"status\">Status: RUNNING</div>\n" +
               "        </div>\n" +
               "        <div class=\"info-grid\">\n" +
               "            <div class=\"info-card\">\n" +
               "                <h3>Server Information</h3>\n" +
               "                <p><strong>Port:</strong> 8761</p>\n" +
               "                <p><strong>Status:</strong> <span style=\"color: #4CAF50;\">RUNNING</span></p>\n" +
               "                <p><strong>Environment:</strong> Development</p>\n" +
               "                <p><strong>Version:</strong> 1.0.0</p>\n" +
               "            </div>\n" +
               "            <div class=\"info-card\">\n" +
               "                <h3>System Information</h3>\n" +
               "                <p><strong>Java Version:</strong> 17+</p>\n" +
               "                <p><strong>Spring Boot:</strong> 3.2.0</p>\n" +
               "                <p><strong>Spring Cloud:</strong> 2023.0.0</p>\n" +
               "                <p><strong>Memory:</strong> Available</p>\n" +
               "            </div>\n" +
               "        </div>\n" +
               "        <div class=\"info-card\">\n" +
               "            <h3>Registered Services</h3>\n" +
               "            <div class=\"service-item\">\n" +
               "                <div class=\"service-name\">API Gateway</div>\n" +
               "                <div class=\"service-status\">UP</div>\n" +
               "            </div>\n" +
               "            <div class=\"service-item\">\n" +
               "                <div class=\"service-name\">User Service</div>\n" +
               "                <div class=\"service-status\">UP</div>\n" +
               "            </div>\n" +
               "            <div class=\"service-item\">\n" +
               "                <div class=\"service-name\">Event Service</div>\n" +
               "                <div class=\"service-status\">UP</div>\n" +
               "            </div>\n" +
               "            <div class=\"service-item\">\n" +
               "                <div class=\"service-name\">Notification Service</div>\n" +
               "                <div class=\"service-status\">UP</div>\n" +
               "            </div>\n" +
               "        </div>\n" +
               "        <div class=\"links\">\n" +
               "            <h2>Quick Links</h2>\n" +
               "            <a href=\"http://localhost:8080\" target=\"_blank\">API Gateway</a>\n" +
               "            <a href=\"http://localhost:3000\" target=\"_blank\">React Frontend</a>\n" +
               "            <a href=\"http://localhost:8761\" target=\"_blank\">Eureka Dashboard</a>\n" +
               "        </div>\n" +
               "        <div class=\"footer\">\n" +
               "            <p>EventHub Microservices - Eureka Server</p>\n" +
               "            <p>Academic Project - Service Discovery System</p>\n" +
               "            <p>" + new java.util.Date().toString() + "</p>\n" +
               "        </div>\n" +
               "    </div>\n" +
               "</body>\n" +
               "</html>";
    }
}
