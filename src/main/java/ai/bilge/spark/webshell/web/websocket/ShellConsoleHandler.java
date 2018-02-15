package ai.bilge.spark.webshell.web.websocket;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.Console;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.PipedInputStream;
import java.io.PrintWriter;
import java.io.Reader;
import java.io.StringReader;
import java.nio.ByteBuffer;
import java.nio.channels.Channel;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.io.input.BoundedInputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.adapter.standard.StandardWebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.xnio.ChannelListener;
import org.xnio.streams.ChannelInputStream;
import org.xnio.streams.ChannelOutputStream;

import io.undertow.websockets.core.AbstractReceiveListener;
import io.undertow.websockets.core.BufferedTextMessage;
import io.undertow.websockets.core.StreamSinkFrameChannel;
import io.undertow.websockets.core.StreamSourceFrameChannel;
import io.undertow.websockets.core.WebSocketChannel;
import io.undertow.websockets.core.WebSocketFrameType;
import io.undertow.websockets.core.WebSockets;
import io.undertow.websockets.jsr.UndertowSession;
import jline.internal.InputStreamReader;

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



	private void createSession(WebSocketSession session) throws IOException {
		WebsocketWriter websocketWriter = new WebsocketWriter(session);
    	java.io.PrintWriter out = new PrintWriter(websocketWriter);
    	ShellConsoleBufferReader shellConsoleBufferReader = new ShellConsoleBufferReader();

    	//InputStream stream = new ByteArrayInputStream(":help\n".getBytes(StandardCharsets.UTF_8));
        Reader targetReader = new InputStreamReader(shellConsoleBufferReader);

	    BufferedReader in = new BufferedReader(targetReader, 1 );

		SparkILoopThread iLoopThread = new SparkILoopThread(in, out);
		ShellSession shellSession = new ShellSession(session.getId(), session, shellConsoleBufferReader, out, iLoopThread);
    	this.sessions.put(session.getId(), shellSession );

    	Thread thread = new Thread(iLoopThread);
		thread.start();
		session.sendMessage(new TextMessage("Initalizing Spark Shell..\n"));

	}



	@Override
	public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
		ShellSession shellSession = this.sessions.get(session.getId());
		if(shellSession==null){
			createSession(session);
		}else{
			Object payload = message.getPayload();
			String command = payload.toString();
			ByteBuffer byteBuffer = ByteBuffer.wrap(command.getBytes());
			int tryRead = shellSession.getIn().tryRead();
			shellSession.getIn().put(byteBuffer);
		}

	}



	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		ShellSession shellSession = this.sessions.get(session.getId());
		if(shellSession==null){
			createSession(session);
		}else{
			Object payload = message.getPayload();
			String command = payload.toString();
			ByteBuffer byteBuffer = ByteBuffer.wrap(command.getBytes());
			int tryRead = shellSession.getIn().tryRead();
			shellSession.getIn().put(byteBuffer);
		}

	}

	@Override
	public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
		super.handleTransportError(session, exception);
	}


	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		//ShellSession shellSession = this.sessions.get(session.getId());
		//String command = ":quit\n";
		//shellSession.getIn().read(command.toCharArray() );

	}

}
