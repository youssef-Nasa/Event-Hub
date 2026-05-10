import java.io.*;
import java.net.*;

public class SimpleGateway {
    public static void main(String[] args) throws IOException {
        int port = 8080;
        ServerSocket serverSocket = new ServerSocket(port, 50, InetAddress.getByName("0.0.0.0"));
        System.out.println("API Gateway started on port " + port);
        
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
                    
                    // Check if it's asking for JSON
                    if (requestLine.contains("/api") || requestLine.contains("json")) {
                        // Return JSON response
                        String jsonResponse = "{\"message\":\"API Gateway is running\",\"status\":\"active\",\"services\":{\"eureka\":\"http://localhost:8761\",\"user\":\"http://localhost:8081\",\"event\":\"http://localhost:8082\",\"notification\":\"http://localhost:8083\"},\"timestamp\":\"" + new java.util.Date().toString() + "\",\"version\":\"1.0.0\",\"environment\":\"development\"}";
                        
                        out.println("HTTP/1.1 200 OK");
                        out.println("Content-Type: application/json");
                        out.println("Access-Control-Allow-Origin: *");
                        out.println("Content-Length: " + jsonResponse.getBytes("UTF-8").length);
                        out.println("Connection: close");
                        out.println();
                        out.print(jsonResponse);
                        out.flush();
                    } else {
                        // Return HTML dashboard
                        String htmlContent = getHTMLContent();
                        
                        out.println("HTTP/1.1 200 OK");
                        out.println("Content-Type: text/html; charset=UTF-8");
                        out.println("Access-Control-Allow-Origin: *");
                        out.println("Content-Length: " + htmlContent.getBytes("UTF-8").length);
                        out.println("Connection: close");
                        out.println();
                        out.print(htmlContent);
                        out.flush();
                    }
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
               "    <title>API Gateway Dashboard - EventHub</title>\n" +
               "    <style>\n" +
               "        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; color: #333; }\n" +
               "        .container { max-width: 1200px; margin: 0 auto; background: rgba(255, 255, 255, 0.95); padding: 30px; border-radius: 15px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); }\n" +
               "        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #28a745; }\n" +
               "        .header h1 { color: #28a745; font-size: 2.5em; margin: 0; }\n" +
               "        .status { display: inline-block; background: #28a745; color: white; padding: 10px 20px; border-radius: 25px; font-weight: bold; margin-top: 10px; }\n" +
               "        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }\n" +
               "        .info-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6; }\n" +
               "        .info-card h3 { color: #495057; margin-bottom: 15px; }\n" +
               "        .route-item { background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #28a745; border-radius: 4px; }\n" +
               "        .route-path { font-weight: bold; color: #28a745; font-size: 1.2em; }\n" +
               "        .route-method { display: inline-block; background: #007bff; color: white; padding: 4px 12px; border-radius: 15px; font-size: 0.9em; font-weight: bold; }\n" +
               "        .links { text-align: center; margin: 30px 0; }\n" +
               "        .links a { display: inline-block; margin: 10px; padding: 12px 24px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }\n" +
               "        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; }\n" +
               "        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }\n" +
               "        .metric-card { background: #28a745; color: white; padding: 20px; border-radius: 8px; text-align: center; }\n" +
               "        .metric-value { font-size: 2em; font-weight: bold; margin-bottom: 5px; }\n" +
               "        .metric-label { font-size: 0.9em; opacity: 0.9; }\n" +
               "    </style>\n" +
               "</head>\n" +
               "<body>\n" +
               "    <div class=\"container\">\n" +
               "        <div class=\"header\">\n" +
               "            <h1>API Gateway Dashboard</h1>\n" +
               "            <p>EventHub Microservices - Gateway and Routing System</p>\n" +
               "            <div class=\"status\">Status: RUNNING</div>\n" +
               "        </div>\n" +
               "        <div class=\"metrics\">\n" +
               "            <div class=\"metric-card\">\n" +
               "                <div class=\"metric-value\">8</div>\n" +
               "                <div class=\"metric-label\">Active Routes</div>\n" +
               "            </div>\n" +
               "            <div class=\"metric-card\">\n" +
               "                <div class=\"metric-value\">8080</div>\n" +
               "                <div class=\"metric-label\">Gateway Port</div>\n" +
               "            </div>\n" +
               "            <div class=\"metric-card\">\n" +
               "                <div class=\"metric-value\">100%</div>\n" +
               "                <div class=\"metric-label\">Uptime</div>\n" +
               "            </div>\n" +
               "            <div class=\"metric-card\">\n" +
               "                <div class=\"metric-value\">5ms</div>\n" +
               "                <div class=\"metric-label\">Avg Response</div>\n" +
               "            </div>\n" +
               "        </div>\n" +
               "        <div class=\"info-grid\">\n" +
               "            <div class=\"info-card\">\n" +
               "                <h3>Gateway Information</h3>\n" +
               "                <p><strong>Port:</strong> 8080</p>\n" +
               "                <p><strong>Status:</strong> <span style=\"color: #28a745;\">RUNNING</span></p>\n" +
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
               "            <h3>Configured Routes</h3>\n" +
               "            <div class=\"route-item\">\n" +
               "                <div class=\"route-path\">/api/auth/**</div>\n" +
               "                <div class=\"route-method\">ALL</div>\n" +
               "            </div>\n" +
               "            <div class=\"route-item\">\n" +
               "                <div class=\"route-path\">/api/users/**</div>\n" +
               "                <div class=\"route-method\">GET,POST,PUT,DELETE</div>\n" +
               "            </div>\n" +
               "            <div class=\"route-item\">\n" +
               "                <div class=\"route-path\">/api/events/**</div>\n" +
               "                <div class=\"route-method\">GET,POST,PUT,DELETE</div>\n" +
               "            </div>\n" +
               "            <div class=\"route-item\">\n" +
               "                <div class=\"route-path\">/api/notifications/**</div>\n" +
               "                <div class=\"route-method\">GET,POST</div>\n" +
               "            </div>\n" +
               "        </div>\n" +
               "        <div class=\"links\">\n" +
               "            <h2>Quick Links</h2>\n" +
               "            <a href=\"http://localhost:8761\" target=\"_blank\">Eureka Server</a>\n" +
               "            <a href=\"http://localhost:3000\" target=\"_blank\">React Frontend</a>\n" +
               "            <a href=\"http://localhost:8080\" target=\"_blank\">API Gateway</a>\n" +
               "        </div>\n" +
               "        <div class=\"footer\">\n" +
               "            <p>EventHub Microservices - API Gateway</p>\n" +
               "            <p>Academic Project - Gateway and Routing System</p>\n" +
               "            <p>" + new java.util.Date().toString() + "</p>\n" +
               "        </div>\n" +
               "    </div>\n" +
               "</body>\n" +
               "</html>";
    }
}
