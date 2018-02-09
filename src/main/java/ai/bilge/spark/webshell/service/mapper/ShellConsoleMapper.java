package ai.bilge.spark.webshell.service.mapper;

import ai.bilge.spark.webshell.domain.*;
import ai.bilge.spark.webshell.service.dto.ShellConsoleDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity ShellConsole and its DTO ShellConsoleDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ShellConsoleMapper extends EntityMapper<ShellConsoleDTO, ShellConsole> {



    default ShellConsole fromId(Long id) {
        if (id == null) {
            return null;
        }
        ShellConsole shellConsole = new ShellConsole();
        shellConsole.setId(id);
        return shellConsole;
    }
}
