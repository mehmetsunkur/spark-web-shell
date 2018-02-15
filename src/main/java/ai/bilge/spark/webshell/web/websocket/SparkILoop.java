package ai.bilge.spark.webshell.web.websocket;

import java.io.BufferedReader;
import java.io.PrintWriter;

import scala.Option;
import scala.tools.nsc.interpreter.InteractiveReader;
import scala.tools.nsc.interpreter.JavapClass;

public class SparkILoop extends org.apache.spark.repl.SparkILoop {


	public SparkILoop(BufferedReader in0, PrintWriter out) {
		super(in0, out);
	}


}
