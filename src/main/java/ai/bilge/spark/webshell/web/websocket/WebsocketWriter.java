package ai.bilge.spark.webshell.web.websocket;

import java.io.IOException;
import java.io.Writer;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

public class WebsocketWriter extends Writer{
	private WebSocketSession session;
	public WebsocketWriter(WebSocketSession session) {
		super();
		this.session = session;
	}
	

    /**
     * Writes characters to the buffer.
     * @param c the data to be written
     * @param off       the start offset in the data
     * @param len       the number of chars that are written
     */
	@Override
    public void write(char c[], int off, int len) {
		String str = new String(c, off, len);
		try {
			session.sendMessage(new TextMessage(str));	
		} catch (Exception e) {
			e.printStackTrace();
		}
    }


	@Override
	public void flush() throws IOException {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void close() throws IOException {
		// TODO Auto-generated method stub
		
	}
		

}
