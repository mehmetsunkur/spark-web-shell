package ai.bilge.spark.webshell.web.websocket;

import java.io.*;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import scala.tools.nsc.Settings;

/**
 * Starts {@link SparkILoop} thread and keeps io between spark and websocket
 */
public class SparkILoopThread implements Runnable {
    private static final Logger log = LoggerFactory.getLogger(SparkILoopThread.class);

    public static final String HADOOP_HOME_DIR = "hadoop.home.dir";
    private PrintWriter out;
	private BufferedReader in;
	private SparkILoop iLoop;
	private Map<String, ShellSession> sessions;
	private ShellSession session;

	public SparkILoopThread(BufferedReader in, PrintWriter out, ShellSession session, Map<String, ShellSession> sessions) {
		super();
		this.out = out;
		this.in = in;
		this.sessions = sessions;
		this.session = session;
	}

	@Override
	public void run() {
        try {
            System.getProperties().put("scala.usejavacp","true");
            String homeDir = System.getProperty("user.dir");
            String userHadoopHomeDirStr = homeDir+ File.separator + "SparkWebShell"+ File.separator + "hadoop";
            File userHadoopHomeDir = new File(userHadoopHomeDirStr);
            if(!userHadoopHomeDir.exists()){
                userHadoopHomeDir.mkdirs();
            }
            if (!userHadoopHomeDir.isAbsolute() || !userHadoopHomeDir.exists() || !userHadoopHomeDir.isDirectory()) {
                throw new IOException("Hadoop home directory " + userHadoopHomeDirStr
                    + " does not exist, is not a directory, or is not an absolute path.");
            }
            userHadoopHomeDirStr = userHadoopHomeDir.getCanonicalPath();
            String  hadoopHome = System.getProperties().getProperty(HADOOP_HOME_DIR);
            if(hadoopHome!=null){
                System.getProperties().remove(HADOOP_HOME_DIR);
            }

            System.getProperties().put("spark.master","local");
            System.getProperties().put(HADOOP_HOME_DIR, userHadoopHomeDirStr);

            this.iLoop = new SparkILoop(this.in,this.out);
            Settings settings = new Settings();
            iLoop.process(settings);
            this.session.getWebSocketSession().close();
        } catch (IOException e) {
            e.printStackTrace();
            if(this.session.getWebSocketSession().isOpen()){
                WebSocketMessage<?> msg = new TextMessage(org.apache.commons.lang.exception.ExceptionUtils.getStackTrace(e));
                try {
                    this.session.getWebSocketSession().sendMessage(msg);
                    this.session.getWebSocketSession().close();
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
            }
        }finally {
            this.sessions.remove(this.session.getSessionId());
        }

	}

}
