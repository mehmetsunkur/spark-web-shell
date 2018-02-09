package ai.bilge.spark.webshell.domain;


import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A ShellConsole.
 */
@Entity
@Table(name = "shell_console")
public class ShellConsole implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "command")
    private String command;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCommand() {
        return command;
    }

    public ShellConsole command(String command) {
        this.command = command;
        return this;
    }

    public void setCommand(String command) {
        this.command = command;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ShellConsole shellConsole = (ShellConsole) o;
        if (shellConsole.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), shellConsole.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ShellConsole{" +
            "id=" + getId() +
            ", command='" + getCommand() + "'" +
            "}";
    }
}
