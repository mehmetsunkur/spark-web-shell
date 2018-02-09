package ai.bilge.spark.webshell.service.dto;


import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the ShellConsole entity.
 */
public class ShellConsoleDTO implements Serializable {

    private Long id;

    private String command;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ShellConsoleDTO shellConsoleDTO = (ShellConsoleDTO) o;
        if(shellConsoleDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), shellConsoleDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ShellConsoleDTO{" +
            "id=" + getId() +
            ", command='" + getCommand() + "'" +
            "}";
    }
}
