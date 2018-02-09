package ai.bilge.spark.webshell.cucumber.stepdefs;

import ai.bilge.spark.webshell.SparkWebShellApp;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.boot.test.context.SpringBootTest;

@WebAppConfiguration
@SpringBootTest
@ContextConfiguration(classes = SparkWebShellApp.class)
public abstract class StepDefs {

    protected ResultActions actions;

}
