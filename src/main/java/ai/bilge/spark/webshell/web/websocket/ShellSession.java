package ai.bilge.spark.webshell.web.websocket;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Reader;
import java.nio.ByteBuffer;
import java.util.Map;

import jline.internal.InputStreamReader;
import org.springframework.web.socket.WebSocketSession;

/**
 * Start session thread and holds session's objects
 */
public class ShellSession {
	private String sessionId;
	private WebSocketSession webSocketSession;
	private SparkILoopThread iLoopThread;
	private PrintWriter out;
	private OneByteBufferInputStream in;
	private Thread sessionThread;

    public ShellSession(WebSocketSession session, Map<String, ShellSession> sessions) throws IOException {
	    this.sessionId = session.getId();
        this.webSocketSession = session;
        this.out = new PrintWriter(new WebsocketWriter(session));
        this.in = new OneByteBufferInputStream();
        BufferedReader in = new BufferedReader(new InputStreamReader(this.in), 1 );
        SparkILoopThread iLoopThread = new SparkILoopThread(in, out, this, sessions);
        sessions.put(session.getId(), this );
        this.sessionThread = new Thread(iLoopThread);
        this.sessionThread.start();
    }

    public void sendCommand(String command) throws InterruptedException {
        ByteBuffer byteBuffer = ByteBuffer.wrap(command.getBytes());
        this.getIn().put(byteBuffer);
    }

    public String getSessionId() {
        return sessionId;
    }

    public WebSocketSession getWebSocketSession() {
        return webSocketSession;
    }

    public SparkILoopThread getiLoopThread() {
        return iLoopThread;
    }

    public PrintWriter getOut() {
        return out;
    }

    public OneByteBufferInputStream getIn() {
        return in;
    }

    public Thread getSessionThread() {
        return sessionThread;
    }
}
