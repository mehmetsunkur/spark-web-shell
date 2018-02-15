package ai.bilge.spark.webshell.web.websocket;

import java.time.Instant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import ai.bilge.spark.webshell.web.websocket.dto.ActivityDTO;

@Component
public class ShellSessionStart {

    private static final Logger log = LoggerFactory.getLogger(ShellSessionStart.class);

    private final SimpMessageSendingOperations messagingTemplate;

    public ShellSessionStart(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        log.info("Received a new web socket connection");
        ActivityDTO activityDTO = new ActivityDTO();
        activityDTO.setSessionId("event.getSessionId()");
        activityDTO.setTime(Instant.now());
        messagingTemplate.convertAndSend("/topic/shell-console-tracker", activityDTO);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if(username != null) {
            log.info("User Disconnected : " + username);

            //ChatMessage chatMessage = new ChatMessage();
            //chatMessage.setType(ChatMessage.MessageType.LEAVE);
            //chatMessage.setSender(username);

            //messagingTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }
    
}
