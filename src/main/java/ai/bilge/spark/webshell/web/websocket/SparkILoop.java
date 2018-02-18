package ai.bilge.spark.webshell.web.websocket;

import java.io.BufferedReader;
import java.io.PrintWriter;

import org.springframework.boot.Banner;
import scala.Option;
import scala.tools.nsc.interpreter.InteractiveReader;
import scala.tools.nsc.interpreter.JavapClass;

/**
 * overrides {@link org.apache.spark.repl.SparkILoop} welcome message
 */
public class SparkILoop extends org.apache.spark.repl.SparkILoop {


	public SparkILoop(BufferedReader in0, PrintWriter out) {
		super(in0, out);
	}

    @Override
    public void printWelcome() {

        String bannerLines[] = {
            "   _____                             __          _       __          __            _____    __            __    __",
            "  / ___/    ____   ____ _   _____   / /__       | |     / /  ___    / /_          / ___/   / /_   ___    / /   / /",
            "  \\__ \\    / __ \\ / __ `/  / ___/  / //_/       | | /| / /  / _ \\  / __ \\         \\__ \\   / __ \\ / _ \\  / /   / / ",
            " ___/ /   / /_/ // /_/ /  / /     / ,<          | |/ |/ /  /  __/ / /_/ /        ___/ /  / / / //  __/ / /   / /  ",
            "/____/   / .___/ \\__,_/  /_/     /_/|_|         |__/|__/   \\___/ /_.___/        /____/  /_/ /_/ \\___/ /_/   /_/   ",
            "        /_/                                                                                                       "
        };
        for (String bannerLine: bannerLines) {
            echo(bannerLine);
        }

        super.printWelcome();
    }


}
