package ai.bilge.spark.webshell.web.websocket;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * Websocket handler for spark shell
 */
@Component
public class ShellConsoleHandler extends TextWebSocketHandler {
	private Map<String, ShellSession> sessions = new ConcurrentHashMap<>();

    private static final Logger log = LoggerFactory.getLogger(ShellConsoleHandler.class);

    private final SimpMessageSendingOperations messagingTemplate;

    public ShellConsoleHandler(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }



    @Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		session.sendMessage(new TextMessage("Spark Web Shell Connection Established..\n"));
    	createSession(session);
	}



	private ShellSession createSession(WebSocketSession session) throws IOException {
		ShellSession shellSession = new ShellSession(session,this.sessions);
    	session.sendMessage(new TextMessage("Initalizing Spark Session, please wait..\n"));
    	return shellSession;
	}


	@Override
	public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        Object payload = message.getPayload();
        String command = payload.toString();
        TextMessage textMessage = new TextMessage(command);
        this.handleTextMessage(session, textMessage);
	}



	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        ShellSession shellSession = this.sessions.get(session.getId());
        if(shellSession==null){
            shellSession = createSession(session);
        }
        Object payload = message.getPayload();
        String command = payload.toString();
        shellSession.sendCommand(command);
	}

	@Override
	public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
		super.handleTransportError(session, exception);
	}


	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		ShellSession shellSession = this.sessions.get(session.getId());
		shellSession.sendCommand(":quit");
	}

}
