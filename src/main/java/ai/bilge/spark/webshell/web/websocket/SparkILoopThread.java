package ai.bilge.spark.webshell.web.websocket;

import java.io.BufferedReader;
import java.io.PrintWriter;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

import org.apache.spark.repl.SparkILoop;

import scala.tools.nsc.Settings;

public class SparkILoopThread implements Runnable {
	private PrintWriter out;
	private BufferedReader in; 
	private SparkILoop iLoop;

	public SparkILoopThread(BufferedReader in, PrintWriter out) {
		super();
		this.out = out;
		this.in = in;
	}

	@Override
	public void run() {
		System.getProperties().put("scala.usejavacp","true");
        System.getProperties().put("hadoop.home.dir","/tmp");
        System.getProperties().put("spark.master","local");

        //org.apache.spark.repl.Main main = new Main();
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("scala");
        //engine.eval()
        //((MutableSettings.BooleanSetting)(((IMain)engine).settings().usejavacp())).value_$eq(true);
        
        this.iLoop = new SparkILoop(this.in,this.out);
        Settings settings = new Settings();

        iLoop.process(settings);
		
	}
	
}
