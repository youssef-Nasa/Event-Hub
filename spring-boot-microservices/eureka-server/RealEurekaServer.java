import java.io.*;
import java.net.*;

public class RealEurekaServer {
    public static void main(String[] args) throws IOException {
        int port = 8761;
        ServerSocket serverSocket = new ServerSocket(port);
        System.out.println("Eureka Server running on port " + port);
        
        while (true) {
            try (Socket clientSocket = serverSocket.accept()) {
                BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);
                
                String requestLine = in.readLine();
                if (requestLine != null && requestLine.startsWith("GET")) {
                    // Read the HTML file
                    String htmlContent = readHtmlFile();
                    
                    // Send HTTP response
                    out.println("HTTP/1.1 200 OK");
                    out.println("Content-Type: text/html; charset=UTF-8");
                    out.println("Access-Control-Allow-Origin: *");
                    out.println("Content-Length: " + htmlContent.length());
                    out.println();
                    out.print(htmlContent);
                }
            }
        }
    }
    
    private static String readHtmlFile() throws IOException {
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader("EUREKA_EMERGENCY.html"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        }
        return content.toString();
    }
}
