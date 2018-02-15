package ai.bilge.spark.webshell.web.websocket;

import java.io.BufferedReader;
import java.io.PrintWriter;

import scala.Option;
import scala.tools.nsc.interpreter.InteractiveReader;
import scala.tools.nsc.interpreter.JavapClass;

public class SparkILoop extends scala.tools.nsc.interpreter.ILoop {
	
	
	public SparkILoop(BufferedReader in0, PrintWriter out) {
		super(in0, out);
		// TODO Auto-generated constructor stub
	}

	public SparkILoop(Option<BufferedReader> in0, PrintWriter out) {
		super(in0, out);
		// TODO Auto-generated constructor stub
	}

	public SparkILoop() {
		// TODO Auto-generated constructor stub
	}

	@Override
	public InteractiveReader in() {
		// TODO Auto-generated method stub
		return super.in();
	}

	@Override
	public JavapClass newJavap() {
		// TODO Auto-generated method stub
		return super.newJavap();
	}

	@Override
	public PrintWriter out() {
		// TODO Auto-generated method stub
		return super.out();
	}
	

}
