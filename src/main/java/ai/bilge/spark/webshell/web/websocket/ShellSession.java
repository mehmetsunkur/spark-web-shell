package ai.bilge.spark.webshell.web.websocket;

import java.io.PrintWriter;

import org.springframework.web.socket.WebSocketSession;

public class ShellSession {
	private String sessionId;
	private WebSocketSession webSocketSession;
	private SparkILoopThread iLoopThread;
	private PrintWriter out;
	private ShellConsoleBufferReader in;
	
	
	
	public ShellSession(String sessionId, WebSocketSession webSocketSession, ShellConsoleBufferReader in, PrintWriter out, SparkILoopThread iLoopThread) {
		super();
		this.sessionId = sessionId;
		this.webSocketSession = webSocketSession;
		this.in = in;
		this.out = out;
		this.iLoopThread = iLoopThread;
	}
	public PrintWriter getOut() {
		return out;
	}
	public void setOut(PrintWriter out) {
		this.out = out;
	}
	public ShellConsoleBufferReader getIn() {
		return in;
	}
	public void setIn(ShellConsoleBufferReader in) {
		this.in = in;
	}
	public String getSessionId() {
		return sessionId;
	}
	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}
	public WebSocketSession getWebSocketSession() {
		return webSocketSession;
	}
	public void setWebSocketSession(WebSocketSession webSocketSession) {
		this.webSocketSession = webSocketSession;
	}

	public SparkILoopThread getiLoopThread() {
		return iLoopThread;
	}
	public void setiLoopThread(SparkILoopThread iLoopThread) {
		this.iLoopThread = iLoopThread;
	}

}
